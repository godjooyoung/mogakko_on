import React from 'react'
import { useCallback } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function CreateRoom() {
  const navigate = useNavigate()
  const OV = useRef(new OpenVidu());

  const [mySessionId, setMySessionId] = useState('') // 진짜 세션아이디로 넣어줘야됨 // 지금은 서버에서 input에 걸려있는 정규식이 영어만 됨
  const [myUserName, setMyUserName] = useState('') //유저의 이름을 넣어줘야됨 
  const [session, setSession] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]); // 서버에서 그 방을 만들때 선택한 인원수를 받아와서 length랑 비교해서 인원수 제한걸기

  const handleChangeSessionId = useCallback((e) => {
    setMySessionId(e.target.value);
  }, []);

  const handleChangeUserName = useCallback((e) => {
    setMyUserName(e.target.value);
  }, []);

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
    console.log('session!!!!!!!!', session)

  }, [mySessionId, deleteSubscriber, navigate, session, myUserName, subscribers]);

  useEffect(() => {
    if (session) {

      navigate(`/room/${mySessionId}`, {
        state: {
          mySessionId,
          myUserName,
          session,
          subscribers,
        }
      });
    }
  }, [session, navigate, mySessionId, myUserName, subscribers]);
  return (
    <>
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
    </>
  )
}

export default CreateRoom