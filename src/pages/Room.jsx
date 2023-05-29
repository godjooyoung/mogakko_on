import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import UserVideoComponent from '../components/UserVideoComponent';
import { useLocation } from 'react-router-dom';

const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';

function Room() {
  const location = useLocation();
  const sessionInfo = location.state
  console.log('세션정보는????',sessionInfo)
  const [mySessionId, setMySessionId] = useState(sessionInfo.mySessionId) // 진짜 세션아이디로 넣어줘야됨 // 지금은 서버에서 input에 걸려있는 정규식이 영어만 됨
  const [myUserName, setMyUserName] = useState(sessionInfo.myUserName) //유저의 이름을 넣어줘야됨 
  const [session, setSession] = useState(undefined);
  const [roomTitle, setRoomTitle] = useState('') // 방제목 받아야함 
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]); // 서버에서 그 방을 만들때 선택한 인원수를 받아와서 length랑 비교해서 인원수 제한걸기
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  //비디오, 오디오 on/off 상태
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)

  const OV = useRef(new OpenVidu());

  const handleChangeSessionId = useCallback((e) => {
    setMySessionId(e.target.value);
  }, []);

  const handleChangeUserName = useCallback((e) => {
    setMyUserName(e.target.value);
  }, []);

  // 메인화면을 누구로 할지 정하는 함수 쉽게 말하면 화면을 누구것을 추적해서 화면에 나타낼지
  const handleMainVideoStream = useCallback((stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  }, [mainStreamManager]);

  // 세션 만들기
  // 세션은 영상 및 음성 통신에 대한 컨테이너 역할(Room).
  const joinSession = useCallback(() => {
    const mySession = OV.current.initSession();

    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((subscribers) => [...subscribers, subscriber]);
    });

    mySession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    //세션 내에서 예외가 발생했을 때 콘솔에 경고메세지
    mySession.on('exception', (exception) => {
      console.warn(exception);
    });

    setSession(mySession);
  }, []);


  useEffect(()=>{
    if(mySessionId && myUserName){
      joinSession()
    }
  },[mySessionId, myUserName])

  // 비디오, 오디오 handler
  const VideoTogglehandler = () => {
    setVideoEnabled((prevValue) => !prevValue);
    publisher.publishVideo(!videoEnabled);
  }

  const AudioTogglehandler = () => {
    setAudioEnabled((prevValue) => !prevValue);
    publisher.publishAudio(!audioEnabled);
  }


  useEffect(() => {
    // 세션이 있으면 그 세션에 publish해라 
    if (session) {
      // 토큰받아오기
      getToken().then(async (token) => {
        try {
          await session.connect(token, { clientData: myUserName });
          // stream만들기 initPublisherAsync() 메소드는 스트림 생성 및 전송 담당를 초기화
          let publisher = await OV.current.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: audioEnabled,
            publishVideo: videoEnabled,
            resolution: '200x200',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false,
          });

          session.publish(publisher);

          const devices = await OV.current.getDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
          const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

          setMainStreamManager(publisher);
          setPublisher(publisher);
          setCurrentVideoDevice(currentVideoDevice);
        } catch (error) {
          console.log('There was an error connecting to the session:', error.code, error.message);
        }
      });
    }
  }, [session, myUserName]);


  const leaveSession = useCallback(() => {
    // Leave the session
    if (session) {
      session.disconnect();
    }

    // Reset all states and OpenVidu object
    OV.current = new OpenVidu();
    setSession(undefined);
    setSubscribers([]);
    setMySessionId(null);
    setMyUserName(null);
    setMainStreamManager(undefined);
    setPublisher(undefined);
  }, [session]);

  // 다른캠으로 사용하기 같음 우리는 이거 빼고 화면 공유 기능 만들어야됨
  //https://docs.openvidu.io/en/stable/advanced-features/screen-share/ 참고
  const switchCamera = useCallback(async () => {
    try {
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(device => device.deviceId !== currentVideoDevice.deviceId);

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.current.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          if (session) {
            await session.unpublish(mainStreamManager);
            await session.publish(newPublisher);
            setCurrentVideoDevice(newVideoDevice[0]);
            setMainStreamManager(newPublisher);
            setPublisher(newPublisher);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentVideoDevice, session, mainStreamManager]);

  const deleteSubscriber = useCallback((streamManager) => {
    setSubscribers((prevSubscribers) => {
      const index = prevSubscribers.indexOf(streamManager);
      if (index > -1) {
        const newSubscribers = [...prevSubscribers];
        newSubscribers.splice(index, 1);
        return newSubscribers;
      } else {
        return prevSubscribers;
      }
    });
  }, []);

  //창이 닫힐때 세션 종료
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      leaveSession();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [leaveSession]);
  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */
  const getToken = useCallback(async () => {
    return createSession(mySessionId).then(sessionId =>
      createToken(sessionId),
    );
  }, [mySessionId]);

  const createSession = async (sessionId) => {
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
      headers: { 'Content-Type': 'application/json', },
    });
    return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
      headers: { 'Content-Type': 'application/json', },
    });
    return response.data; // The token
  };
  return (
    <div className="container">
      {/* 세션이 없으면  */}
      {session === undefined ? (
        <div>
          <div>
            <h1> Join a video session </h1>
            <form onSubmit={joinSession}>
              <p>
                <label>Participant: </label>
                <input
                  type="text"
                  value={myUserName}
                  onChange={handleChangeUserName}
                  required
                />
              </p>
              <p>
                <label> Session: </label>
                <input
                  type="text"
                  value={mySessionId}
                  onChange={handleChangeSessionId}
                  required
                />
              </p>
              <p>
                <input name="commit" type="submit" value="JOIN" />
              </p>
            </form>
          </div>
        </div>
      ) : null}
      {/* 세션이 있으면  */}
      {session !== undefined ? (
        <div>
          <div>
            <h1>{mySessionId}</h1>
            <input
              type="button"
              onClick={leaveSession}
              value="Leave session"
            />
            <input
              type="button"
              onClick={switchCamera}
              value="Switch Camera"
            />
          </div>

          {mainStreamManager !== undefined ? (
            <div>
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : null}
          <div>
            {publisher !== undefined ? (
              <div onClick={() => handleMainVideoStream(publisher)}>
                <UserVideoComponent
                  streamManager={publisher} />
                <input
                  type="button"
                  onClick={VideoTogglehandler}
                  value={videoEnabled ? "Cam Off" : "Cam On"}
                />
                <input
                  type="button"
                  onClick={AudioTogglehandler}
                  value={audioEnabled ? "Audio Off" : "Audio On"}
                />
              </div>
            ) : null}
            {subscribers.map((e, i) => (
              <div key={e.id} onClick={() => handleMainVideoStream(e)}>
                <span>{e.id}</span>
                <UserVideoComponent streamManager={e} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}


export default Room