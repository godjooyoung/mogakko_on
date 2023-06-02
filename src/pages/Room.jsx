import { OpenVidu } from 'openvidu-browser'
import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import UserVideoComponent from '../components/UserVideoComponent'
import { useLocation } from 'react-router-dom'
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import { styled } from 'styled-components'
import useInput from '../hooks/useInput';
import { getCookie } from '../cookie/Cookie';

const APPLICATION_SERVER_URL = process.env.REACT_APP_OPEN_VIDU_SERVER

function Room() {
  const location = useLocation()
  const sessionInfo = location.state
  
  const [mySessionId, setMySessionId] = useState(sessionInfo.mySessionId) //진짜 세션아이디로 넣어줘야됨 (지금은 서버에서 input에 걸려있는 정규식이 영어만 됨)
  const [myUserName, setMyUserName] = useState(sessionInfo.myUserName) //유저의 이름을 넣어줘야됨 
  const [session, setSession] = useState(undefined)
  const [roomTitle, setRoomTitle] = useState('') //TODO 방제목 인풋 만들어야함
  const [mainStreamManager, setMainStreamManager] = useState(undefined)
  const [publisher, setPublisher] = useState(undefined)
  const [subscribers, setSubscribers] = useState([]); //서버에서 그 방을 만들때 선택한 인원수를 받아와서 length랑 비교해서 인원수 제한걸기
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  //비디오, 오디오 on/off 상태
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)

  // Websocket
  const [isLoading, setIsLoading] = useState(true)
  const isConnected = useRef('')
  const stompClient = useRef(null)
  // isOpen 
  const [isOpened, setIsOpened] = useState(true)
  // const [isOpened, setIsOpened] = useState('')

  const [btnSelect, setBtnSelect] = useState('')

  const publicHandler = () => {
    setIsOpened(true)
  }

  const closedHandler = (e) => {
    setIsOpened(false)
  }

  // 보내는 메세지
  const [message, setMessage] = useState('')

  // language
  const [languageList, setLanguageList] = useState(
    [
      { language: 'JAVA', isSelected: false },
      { language: 'JAVASCRIPT', isSelected: false },
      { language: 'PYTHON', isSelected: false },
      { language: 'C', isSelected: false },
      { language: 'C#', isSelected: false },
      { language: 'C++', isSelected: false },
      { language: 'RUBY', isSelected: false },
      { language: 'KOTLIN', isSelected: false },
      { language: 'SWIFT', isSelected: false },
      { language: 'GO', isSelected: false },
      { language: 'PHP', isSelected: false },
      { language: 'RUST', isSelected: false },
      { language: 'LUA', isSelected: false },
      { language: 'ETC', isSelected: false },
    ]
  )
  // 언어 버튼 클릭 이벤트
  const onClickLanguageHandler = (idx, isSelected) => {
    const updateLanguageList = languageList.map((language, index) => {
      if (index === idx) {
        return { ...language, isSelected: !isSelected };
      } else {
        return { ...language, isSelected: false };
      }
    });
    setLanguageList(updateLanguageList);
  }

  // 언어 버튼 선택한 value 가져오기
  const [lang, setLang] = useState('')
  useEffect(() => {
    const setFiltering = () => {
      languageList.map((language) => {
        if (language.isSelected) {
          setLang(language.language)
        }
      });
    }
    setFiltering()
  }, [languageList])

  // maxMembers
  const maxMembers = [2, 4, 6, 8]

  const [curMaxMembers, setCurMaxMembers] = useState(0)
  const maxMembersHandler = (e) => {
    setCurMaxMembers(e)
  }

  const [closedPassword, onChangeClosedPassword, closedPasswordReset] = useInput('')
  const [PasswordCheck, onChangePasswordCheck, passwordCheckReset] = useInput('')

  const [data, setData] = useState({
    title: '',
    language: '',
    maxMembers: '',
    isOpened: false,
    password: '',
    lon: sessionInfo.longitude,
    lat: sessionInfo.latitude,
    neighborhood: sessionInfo.neighborhood
  })

  const OV = useRef(new OpenVidu())

  // const handleChangeSessionId = useCallback((e) => {
  //   setMySessionId(e.target.value)
  // }, []);

  const handleChangeRoomTitle = useCallback((e) => {
    setRoomTitle(e.target.value)
  }, []);

  // 메인화면을 어느 스트림으로 할지 정하는 함수. 어느것을 추적해서 메인 화면으로 나타낼지
  const handleMainVideoStream = useCallback((stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream)
    }
  }, [mainStreamManager])

  // 세션 만들기
  // 세션은 영상 및 음성 통신에 대한 컨테이너 역할(Room)
  const joinSession = useCallback(() => {
    const mySession = OV.current.initSession()

    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined)
      setSubscribers((subscribers) => [...subscribers, subscriber])
    });

    mySession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager)
    });

    //세션 내에서 예외가 발생했을 때 콘솔에 경고메세지
    mySession.on('exception', (exception) => {
      console.warn(exception)
    });

    setSession(mySession)

    // setData({...data, ...{
    //   title: roomTitle,
    //   language: lang,
    //   maxMembers: curMaxMembers,
    //   isOpened,
    //   password: closedPassword
    // }})
  }, [])

  // TEMP
  const onClickTempButton = () => {
    console.log("lang >>>>>>>>> ",lang)
    setData({...data, ...{
      title: roomTitle,
      language : lang,
      maxMembers: curMaxMembers,
      isOpened,
      password: closedPassword
    }})
  }

  // 목록에서 방으로 바로 접근 할경우 실행되는 useEffect
  useEffect(() => {
    if (sessionInfo) {
      if (sessionInfo.isDirect) {
        joinSession()
      }
    }
  }, [mySessionId])

  // 비디오, 오디오 handler
  const VideoTogglehandler = () => {
    setVideoEnabled((prevValue) => !prevValue)
    publisher.publishVideo(!videoEnabled)
  }

  const AudioTogglehandler = () => {
    setAudioEnabled((prevValue) => !prevValue)
    publisher.publishAudio(!audioEnabled)
  }

  const startCameraSharing = useCallback(async (originPublish) => {
    try {
      // 카메라 퍼블리셔 초기화
      const cameraPublisher = OV.current.initPublisher(undefined, {
        videoSource: currentVideoDevice ? currentVideoDevice.deviceId : undefined,
        publishVideo: true,
        mirror: false,
        audioSource: undefined,
        publishAudio: audioEnabled,
        publishVideo: videoEnabled,
        resolution: '200x200',
        frameRate: 30,
        insertMode: 'APPEND',
      });
      // 퍼블리셔를 세션에 게시
      session.publish(cameraPublisher)

      // 기존 퍼블리시 제거
      session.unpublish(originPublish)
      setMainStreamManager(cameraPublisher)

      // 상태 업데이트
      setPublisher(cameraPublisher)
      setIsScreenSharing(false)
    } catch (error) {
      console.log('Error starting camera sharing:', error.message)
    }
  }, [currentVideoDevice, session]);

  const startScreenSharing = useCallback(async (originPublish) => {
    try {

      // 화면 공유용 퍼블리셔 초기화
      const screenSharingPublisher = OV.current.initPublisher(undefined, {
        videoSource: 'screen',
        publishVideo: true,
        mirror: false,
        audioSource: undefined,
        publishAudio: audioEnabled,
        publishVideo: videoEnabled,
        resolution: '200x200',
        frameRate: 30,
        insertMode: 'APPEND',
      });

      // 퍼블리셔를 세션에 게시
      session.publish(screenSharingPublisher);

      // 기존 퍼블리시 제거
      session.unpublish(originPublish)
      setMainStreamManager(screenSharingPublisher);

      // 상태 업데이트
      setPublisher(screenSharingPublisher);

      setIsScreenSharing(true);
    } catch (error) {
      console.log('Error starting screen sharing:', error.message);
    }
  }, [session]);

  const toggleSharingMode = useCallback((originPublish) => {
    if (isScreenSharing) {
      // 화면 공유 모드일 때, 카메라로 전환
      startCameraSharing(originPublish);
    } else {
      // 카메라 모드일 때, 화면 공유로 전환
      startScreenSharing(originPublish);
    }
  }, [isScreenSharing, startCameraSharing, startScreenSharing]);


  useEffect(() => {
    // 세션이 있으면 그 세션에 publish해라 
    if (session) {
      // 토큰받아오기
      getToken().then(async (response) => {
        console.log("입장토큰>",response.data)
        try {
          await session.connect(response.data, { clientData: myUserName });
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

    OV.current = new OpenVidu();
    setSession(undefined);
    setSubscribers([]);
    setMySessionId(null);
    setMyUserName(null);
    setMainStreamManager(undefined);
    setPublisher(undefined);
  }, [session]);

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
    return createSession(data).then(sessionId =>
      createToken(sessionId),
    );
  }, [data]);



  // "mogakkoRoomCreateRequestDto": {
  //   "title": "string",
  //   "language": "JAVA",
  //   "maxMembers": 0,
  //   "isOpened": true,
  //   "neighborhood": "string",
  //   "password": "string",
  //   "lon": 0,
  //   "lat": 0
  // },
  // 르탄이3zz
  // ses_WR91bvlQis


  // {
  //  isOpened === '' || isOpened === 'public' ? false : true 
  // }

  const createSession = async (data) => {
    console.log("##### createSession", data)
    const response = await axios.post(APPLICATION_SERVER_URL + '/mogakko',
      data,
      {
        headers: { ACCESS_KEY: getCookie('token')},
      });
    console.log("##### sessionID ??????????", response.data.data.sessionId)
    return response.data.data.sessionId; // The sessionId
  };

  const createToken = async (sessionId) => {
    console.log("##### createToken", sessionId)
    const response = await axios.post(APPLICATION_SERVER_URL + '/mogakko/' + sessionId, {}, {
      headers: { 
        ACCESS_KEY: getCookie('token'),
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        // 'Access-Control-Allow-Headers': 'Content-Type'
      },
    });
    console.log("##### createToken !!!!!!!!!!>>>>", response)
    return response.data; // The token
  };


  const connect = () => {
    // SockJS같은 별도의 솔루션을 이용하고자 하면 over 메소드를, 그렇지 않다면 Client 메소드를 사용해주면 되는 듯.
    stompClient.current = new Client({
      // brokerURL이 http 일경우 ws를 https일 경우 wss를 붙여서 사용하시면 됩니다!
      // brokerURL: "ws://localhost:8080/ws-stomp/websocket", // 웹소켓 서버로 직접 접속
      // brokerURL: `${process.env.REACT_APP_WEB_SOCKET_SERVER}/room`, // 웹소켓 서버로 직접 접속

      /* ws://15.164.159.168:8080/ws-stomp */
      // brokerURL: `${process.env.REACT_APP_WEB_SOCKET_SERVER}`, // 웹소켓 서버로 직접 접속
      // connectHeaders: An object containing custom headers to send during the connection handshake.
      connectHeaders: {
        // Authorization: `Bearer ${checkCookie}`,쿠키 넣으면됨
      },
      debug: (debug) => {
        console.log("debug : ", debug);
      },
      reconnectDelay: 0,

      heartbeatIncoming: 4000,

      heartbeatOutgoing: 4000,

      // 검증 부분
      webSocketFactory: () => {
        const socket = new SockJS("http://15.164.159.168:8080/ws-stomp");
        socket.onopen = function () {
          socket.send(
            JSON.stringify({
              // Authorization: `Bearer ${checkCookie}`,쿠기 넣으면됨
            })
          );
        };
        return socket;
      },

      // 검증이 돼서 Room을 열어주는 서버랑 연결이 되면
      onConnect: async () => {
        console.log("Connected to the broker. Initiate subscribing.");
        isConnected.current = true;
        await subscribe();
        await publish();
        await textPublish();
      },

      onStompError: (frame) => {
        console.log(frame);
        console.log("Broker reported error: " + frame.headers["message"]);
        console.log("Additional details: " + frame.body);
      },
      onWebSocketError: (frame) => {
        console.log(frame);
      },
      onWebSocketClose: () => {
        console.log("web socket closed");
      },
    });
    stompClient.current.activate();
  };


  const subscribe = () => {
    stompClient.current.subscribe(
      // `/sub/chat/room/${roomId}`,

      (data) => {
        console.log(" 구독됨", JSON.parse(data.body))
        const response = JSON.parse(data.body)
        // setMessage() 여기에 response값 받아서 저장하고 이 state를 map해주면 될꺼같음 
        // 타입 구별만 하면 끝 서버에서 response값으로 type을 보내주면 그거로 enter publish에 대한 값인지 talk에 대한값인지
        // enter type은 입장메세지
        // talk type은 채팅 메세지(내가 보낸 input값 상대가 보낸 메세지 값)
        // 그러면 enter type 입장메세지도? massage state에 넣은후에? 뒤에 채팅 메세지를 스프레드 연산자로 붙여 넣고 그걸 mapping하면 될듯함
      }
    );
  };

  const publish = async () => {
    if (!stompClient.current.connected) {
      return;
    }
    console.log("publish 시작");

    await stompClient.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({
        type: "ENTER",

      }),
      // headers: { authorization: `Bearer ${checkCookie}` }, 쿠키 넣어줘야됨

      //
    });
    console.log("publish 끝");
    setIsLoading(false);
  };

  const textPublish = () => {
    console.log("textPublish Start");
    if (message !== "") {
      stompClient.current.publish({
        destination: "/pub/chat/message",
        body: JSON.stringify({
          type: "TALK",
          message,
        }),
        // headers: { authorization: `Bearer ${checkCookie}` }, 쿠기 넣어줘야됨
        //
      });
      console.log("textPublish End");
      setMessage("");
    }
  };

  //TODO 로딩일때 화면만들어서 붙여주기 
  // if (isLoading) {
  //   return (
  //     <div>
  //       <Loading /> 
  //     </div>
  //   );
  // }

  return (
    <div className="container">
      {/* 세션이 없으면  */}
      {session === undefined ? (
        <div>
          <div>
            <h1> 방 만들기 </h1>
            <form onSubmit={joinSession}>
              <p>
                <label>방이름 </label>
                <input
                  type="text"
                  value={roomTitle}
                  onChange={handleChangeRoomTitle}
                  required
                />
              </p>
              <div>
                {
                  languageList.map((language, idx) => {
                    return (
                      <button isSelected={language.isSelected} onClick={(e) => {
                        e.preventDefault()
                        onClickLanguageHandler(idx, language.isSelected)
                      }}>{language.language}</button>
                    )
                  })
                }
              </div>
              <div>
                <p>최대인원</p>
                {
                  maxMembers.map((ele, idx) => {
                    return (
                      <button key={idx} onClick={(e) => {
                        e.preventDefault()
                        maxMembersHandler(ele)
                      }}>{ele}</button>
                    )
                  })
                }
              </div>
              <div>
                <p>공개 여부</p>
                <PublicBtn btnSelect={btnSelect}
                  onClick={(e) => {
                    e.preventDefault()
                    setBtnSelect('public')
                    publicHandler()
                  }}>
                  공개</PublicBtn>
                <ClosedBtn btnSelect={btnSelect}
                  onClick={(e) => {
                    e.preventDefault()
                    setBtnSelect('closed')
                    closedHandler()
                  }}>비공개</ClosedBtn>
              </div>
              {
                !isOpened &&
                <div>
                  <input type="text"
                    value={closedPassword}
                    onChange={(e) => {
                      onChangeClosedPassword(e)
                    }}
                    placeholder='비밀번호를 입력해주세요'
                  />
                  <input type="text"
                    value={PasswordCheck}
                    onChange={(e) => {
                      onChangePasswordCheck(e)
                    }}
                    placeholder='비밀번호재입력'
                  />
                </div>
              }
              <p>
                <input name="commit" type="submit" value="JOIN" />
              </p>
            </form>
            <button onClick={onClickTempButton}>TEMP</button>
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
          </div>
          <button onClick={() => { toggleSharingMode(publisher) }}>
            {isScreenSharing ? 'Switch to Camera' : 'Switch to Screen Sharing'}
          </button>

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

const PublicBtn = styled.button`
  width: 200px;
  height: 50px;
  background-color: ${({ btnSelect }) =>
    btnSelect === 'public' ? 'yellow' : 'white'
  };
`

const ClosedBtn = styled.button`
  width: 200px;
  height: 50px;
  background-color: ${({ btnSelect }) =>
    btnSelect === 'closed' ? 'yellow' : 'white'
  };
`

export default Room