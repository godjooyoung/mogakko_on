import { OpenVidu } from 'openvidu-browser'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import UserVideoComponent from '../components/UserVideoComponent'
import { useLocation, useNavigate } from 'react-router-dom'
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import { styled, keyframes } from 'styled-components'
import useInput from '../hooks/useInput'
import { getCookie } from '../cookie/Cookie'
import { useMutation } from 'react-query'
import { leaveChatRoom } from '../axios/api/chat'
import Header from '../components/common/Header';
import Stopwatch from '../components/Stopwatch'
import CommonPopup from '../components/common/CommonPopup'
import SnackBar from '../components/common/SnackBar'
import { jwtInstance } from '../axios/apiConfig'
import ReportPopup from '../components/common/ReportPopup'
import CodeEditor from '../components/CodeEditor'

const APPLICATION_SERVER_URL = process.env.REACT_APP_OPEN_VIDU_SERVER

function Room() {
  const location = useLocation()
  const navigate = useNavigate()

  const sessionInfo = location.state

  const [mySessionId, setMySessionId] = useState(sessionInfo.mySessionId) //진짜 세션아이디로 넣어줘야됨 (지금은 서버에서 input에 걸려있는 정규식이 영어만 됨)
  const [myUserName, setMyUserName] = useState(sessionInfo.myUserName) //유저의 이름을 넣어줘야됨 
  const [session, setSession] = useState(undefined)
  const [roomTitle, setRoomTitle] = useState(sessionInfo.title)
  const [mainStreamManager, setMainStreamManager] = useState(undefined)
  const [publisher, setPublisher] = useState(undefined)
  const [subscribers, setSubscribers] = useState([]) //서버에서 그 방을 만들때 선택한 인원수를 받아와서 length랑 비교해서 인원수 제한걸기
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [lang, setLang] = useState(sessionInfo.language)

  const [sessionConnect, setSessionConnect] = useState(false)

  const [isOpened, setIsOpened] = useState(true)   // isOpen 공개방 여부
  const [openViduSession, setOpenViduSession] = useState(undefined)

  //비디오, 오디오 on/off 상태
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)

  // on/off 바뀜
  const [isChangedProperty, setIsChangedProperty] = useState(false)

  //화면 공유 실패시 다시 시도하기 위한 상태값
  const [isRetry, setIsRetry] = useState(false)

  // Websocket
  const [isLoading, setIsLoading] = useState(true)
  const isConnected = useRef('')
  const stompClient = useRef(null)

  // 스낵바 메세지 
  const [snackbarMsg, setSnackbarMsg] = useState('')

  // 스낵바 활성 여부 
  const [isActiveSnackbar, setIsActiveSnackbar] = useState(false)

  const [snackbarStatus, setSnackbarStatus] = useState(null)

  // 모각코 안내 팝업 활성 여부
  const [roomPopUp, setRoomPopUp] = useState(false)


  // 뒤로 가기 막기 팝업 활성 여부
  const [isblocked, setIsblocked] = useState(false)

  // 나가기 팝업 활성 여부
  const [isBeforeLeave, setIsBeforeLeave] = useState(false)


  // 닉네임
  const [getUserNickname, setGetUserNickname] = useState(null)

  // SnackBar 신고 메세지
  const [reportMsg, setReportMsg] = useState(null)

  // 신고 SnackBar 토글 
  const [reportSnackBar, setReportSnackBar] = useState(false)
  // reportPopup
  const [reportPopup, setReportPopup] = useState(false)

  //코드 에디터
  const [code, setCode] = useState('');

  const handleCodeChange = (value) => {
    setCode(value);
  };

  // 코드 에디터 토글 버튼
  const [codeEditor, setCodeEditor] = useState(false)

  const codeEditorToggleHandler = () => {
    setCodeEditor(!codeEditor)
  }

  // nickname 가져오기
  const getUserNicknameHandler = (nickname) => {
    setGetUserNickname(nickname)
    setReportPopup(true)
  }

  // SnackBar 신고 메세지 가져오기
  const getReportMsgHandler = (msg) => {
    setReportMsg(msg)
  }

  useEffect(() => {
    if (reportMsg) {
      setReportSnackBar(true)
    }
  }, [reportMsg])
  // reportPopup 닫기
  const closeReportPopupHandler = () => {
    setReportPopup(false)
  }

  // 뒤로가기 동작 감지
  const preventGoBack = () => {
    window.history.pushState(null, "", location.href);
    setIsblocked(true)
  };

  useEffect(() => {
    window.history.pushState(null, "", location.href);
    window.addEventListener("popstate", preventGoBack);

    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);

  // 나가기 버튼클릭 시 팝업 띄우기 위해서 동작하는 함수
  const leavePopOpenHandler = () => {
    setIsBeforeLeave(true)
  }

  // 스낵바 메세지 세팅하고 나면 스낵바 랜더링 해주는 값 변경 해주는 useEffect
  useEffect(() => {
    if (snackbarMsg) {
      console.log('메세지', snackbarMsg)
      setIsActiveSnackbar(true)
    }
  }, [snackbarMsg])

  // 스낵바 열리고 나면 자동으로 닫히도록 하는 useEffect
  useEffect(() => {
    console.log('isActivee 상태', isActiveSnackbar)
    if (isActiveSnackbar) {

      setSnackbarStatus(Math.random())

      const timer = setTimeout(() => {
        setIsActiveSnackbar(false)
        setSnackbarMsg('')
      }, 3000)

      return () => clearTimeout(timer)
    }

    if (reportSnackBar) {
      const timer = setTimeout(() => {
        setReportSnackBar(false)
        setReportMsg('')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isActiveSnackbar, reportSnackBar])

  useEffect(() => {
    console.log('snackbarStatus 상태', snackbarStatus)
  }, [snackbarStatus])


  // 리브세션 서버 요청
  const leaveSessionMutation = useMutation(leaveChatRoom, {
    onSuccess: (response) => {
      setIsLeaved(true)
    },
    onError: (error) => {
      setIsLeaved(true)
    }
  })

  // 보내는 메세지
  const [message, setMessage] = useState('')

  // 받는 메세지 
  const [chatMessages, setChatMessages] = useState([]);

  // language
  const [languageList, setLanguageList] = useState(
    [
      { language: 'JAVA', isSelected: false, img: `${process.env.PUBLIC_URL}/image/mkRmJava0.webp`, value: 'Java', imgSeltedUrl: `${process.env.PUBLIC_URL}/image/mkRmJava1.webp`, imgHoverUrl: `${process.env.PUBLIC_URL}/image/mkRmJava2.webp`, },
      { language: 'JAVASCRIPT', isSelected: false, img: `${process.env.PUBLIC_URL}/image/mkRmJs0.webp`, value: 'JavaScript', imgSeltedUrl: `${process.env.PUBLIC_URL}/image/mkRmJs1.webp`, imgHoverUrl: `${process.env.PUBLIC_URL}/image/mkRmJs2.webp`, },
      { language: 'PYTHON', isSelected: false, img: `${process.env.PUBLIC_URL}/image/mkRmPy0.webp`, value: 'Python', imgSeltedUrl: `${process.env.PUBLIC_URL}/image/mkRmPy1.webp`, imgHoverUrl: `${process.env.PUBLIC_URL}/image/mkRmPy2.webp`, },
      { language: 'C', isSelected: false, img: `${process.env.PUBLIC_URL}/image/mkRmC0.webp`, value: 'C', imgSeltedUrl: `${process.env.PUBLIC_URL}/image/mkRmC1.webp`, imgHoverUrl: `${process.env.PUBLIC_URL}/image/mkRmC2.webp`, },
      { language: 'C#', isSelected: false, img: `${process.env.PUBLIC_URL}/image/mkRmCs0.webp`, value: 'C#', imgSeltedUrl: `${process.env.PUBLIC_URL}/image/mkRmCs1.webp`, imgHoverUrl: `${process.env.PUBLIC_URL}/image/mkRmCs2.webp`, },
      { language: 'C++', isSelected: false, img: `${process.env.PUBLIC_URL}/image/mkRmCp0.webp`, value: 'C++', imgSeltedUrl: `${process.env.PUBLIC_URL}/image/mkRmCp1.webp`, imgHoverUrl: `${process.env.PUBLIC_URL}/image/mkRmCp2.webp`, },
      { language: 'KOTLIN', isSelected: false, img: `${process.env.PUBLIC_URL}/image/mkRmKt0.webp`, value: 'Kotlin', imgSeltedUrl: `${process.env.PUBLIC_URL}/image/mkRmKt1.webp`, imgHoverUrl: `${process.env.PUBLIC_URL}/image/mkRmKt2.webp`, },
      { language: 'ETC', isSelected: false, img: `${process.env.PUBLIC_URL}/image/mkRmEtc0.webp`, value: '', imgSeltedUrl: `${process.env.PUBLIC_URL}/image/mkRmEtc1.webp`, imgHoverUrl: `${process.env.PUBLIC_URL}/image/mkRmEtc2.webp`, }
    ]
  )

  // 언어 버튼 클릭 이벤트
  const onClickLanguageHandler = (idx, isSelected) => {
    const updateLanguageList = languageList.map((language, index) => {
      if (index === idx) {
        return { ...language, isSelected: !isSelected }
      } else {
        return { ...language, isSelected: false }
      }
    })
    setLanguageList(updateLanguageList)
  }

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
  const [maxMembers, setMaxMembers] = useState([
    { num: 2, isSelected: false },
    { num: 4, isSelected: false },
    { num: 6, isSelected: false },
    { num: 8, isSelected: false },
  ])

  const [curMaxMembers, setCurMaxMembers] = useState(0)

  const maxMembersHandler = (e, isSelected, idx) => {
    const updateMaxMembersList = maxMembers.map((num, index) => {
      if (index === idx) {
        return { ...num, isSelected: !isSelected }
      } else {
        return { ...num, isSelected: false }
      }
    })
    setMaxMembers(updateMaxMembersList)
    setCurMaxMembers(e)
  }

  // 비공개방 - 비밀번호, 비밀번호 확인
  const [closedPassword, onChangeClosedPassword, closedPasswordReset] = useInput('')
  const [PasswordCheck, onChangePasswordCheck, passwordCheckReset] = useInput('')

  const [data, setData] = useState({
    title: sessionInfo.title,
    language: sessionInfo.language,
    maxMembers: sessionInfo.maxMembers,
    isOpened: true,
    password: sessionInfo.password,
    lon: sessionInfo.longitude,
    lat: sessionInfo.latitude,
    neighborhood: sessionInfo.neighborhood
  })

  const languageImgHandler = () => {
    if (data.language === 'JAVA') {
      return <img src={`${process.env.PUBLIC_URL}/image/roomJavaIcon.webp`} alt="Java아이콘" />
    } else if (data.language === 'JAVASCRIPT') {
      return <img src={`${process.env.PUBLIC_URL}/image/roomJsIcon.webp`} alt="Java아이콘" />
    } else if (data.language === 'PYTHON') {
      return <img src={`${process.env.PUBLIC_URL}/image/roomPythonIcon.webp`} alt="Java아이콘" />
    } else if (data.language === 'C') {
      return <img src={`${process.env.PUBLIC_URL}/image/roomCIcon.webp`} alt="Java아이콘" />
    } else if (data.language === 'C#') {
      return <img src={`${process.env.PUBLIC_URL}/image/roomCsharpIcon.webp`} alt="Java아이콘" />
    } else if (data.language === 'C++') {
      return <img src={`${process.env.PUBLIC_URL}/image/roomCplusIcon.webp`} alt="Java아이콘" />
    } else if (data.language === 'KOTLIN') {
      return <img src={`${process.env.PUBLIC_URL}/image/roomIconKt.webp`} alt="Java아이콘" />
    } else if (data.language === 'ETC') {
      return <img src={`${process.env.PUBLIC_URL}/image/roomIconEtc.webp`} alt="Java아이콘" />
    }
  }

  const OV = useRef(new OpenVidu())

  const handleChangeRoomTitle = useCallback((e) => {
    if (e.target.value.length > 15) {
      setRoomTitle(e.target.value.slice(0, 15))
    } else {
      setRoomTitle(e.target.value)
    }
  }, []);

  // 메인화면을 어느 스트림으로 할지 정하는 함수. 어느것을 추적해서 메인 화면으로 나타낼지
  const handleMainVideoStream = useCallback((stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream)
    }
  }, [mainStreamManager])

  const joinSession = () => {
    OV.current = new OpenVidu();
    const mySession = OV.current.initSession();
    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber])
    })

    mySession.on('streamPropertyChanged', (event) => {
      setIsChangedProperty((prevIsChangedProperty) => (!prevIsChangedProperty))
    })

    mySession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager)
    })

    mySession.on('exception', (exception) => {
      // console.warn(exception);
    })
    console.log("*️⃣ [tracking] 조인 세션에서 상태값 세션 세팅")
    setSession(()=>(mySession))
  };

  const [isFisrstSubscribe, setIsFisrstSubscribe] = useState(false)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    if (!isGuest || openViduSession) { 
      if (!isFisrstSubscribe) { 
        if (openViduSession) {
          connect(openViduSession)
        } else {
          connect(mySessionId)
          setIsGuest(true)
          setIsFisrstSubscribe(true)
        }
      }
    }
  }, [openViduSession])

  // TEMP
  const onClickTempButton = () => {
    if (sessionInfo) {
      if (sessionInfo.isDirect) {
        setData({
          ...data, ...{
            title: sessionInfo.title,
            language: sessionInfo.language,
            maxMembers: sessionInfo.maxMembers,
            isOpened: true,
            isOpened: sessionInfo.isOpened,
            password: sessionInfo.password,
          }
        })
      } else {
        setData({
          ...data, ...{
            title: roomTitle,
            language: lang,
            maxMembers: curMaxMembers,
            isOpened: isOpened,
            password: closedPassword
          }
        })
      }
    }
  }

  // 값이 입력될때마다 입력된 state들을 세팅
  useEffect(() => {
    onClickTempButton()
  }, [roomTitle, lang, isOpened, curMaxMembers, closedPassword, PasswordCheck])

  useEffect(() => {
    if (sessionInfo.isDirect) {
      joinSession()
    }
  }, [data])

  useEffect(() => {
    setSubscribers((prevSubscribers) => [...prevSubscribers])
  }, [publisher, audioEnabled, isChangedProperty, session])


  // 목록에서 방으로 바로 접근 할경우 실행되는 useEffect
  useEffect(() => {
    if (sessionInfo) {
      if (sessionInfo.isDirect) {
        onClickTempButton()
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
      // console.log('Error starting camera sharing:', error.message)
    }
  }, [currentVideoDevice, session, audioEnabled])

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
        frameRate: 30,
        insertMode: 'APPEND',
      })
      
      console.log("1️⃣ [tracking] originPublish ", originPublish)
      console.log("1️⃣ [tracking] session ", session)

      if(session.streamManagers.length>0){
        console.log("2️⃣ [tracking] 끼래기 ", session.streamManagers.length)
        console.log("2️⃣ [tracking] 세션에 스트림매니저 존재")
        await session.unpublish(originPublish)
      }else{
        console.log("2️⃣ [tracking] 끼래기 ", 0)
        console.log("2️⃣ [tracking] 세션에 스트림매니저 없음")
        setSession(()=>(originPublish.session))
        console.log("2️⃣ [tracking] 세션을 재 세팅")
        await session.unpublish(originPublish)
      }
      console.log("3️⃣ [tracking] 오리진 퍼블리시 언퍼블리시 완료")

      console.log("3️⃣ [tracking] 전체 서브스크라이브 업데이트 시도")
      setSubscribers(prevSubscribers => {
        console.log("3️⃣ [tracking] 전체 서브스크라이브 업데이트 중.")
        const newSubscribers = [...prevSubscribers]
        console.log("3️⃣ [tracking] 전체 서브스크라이브 업데이트 중..")
        return newSubscribers
      })
      console.log("3️⃣ [tracking] 전체 서브스크라이브 업데이트 완료")
      
      console.log("4️⃣ [tracking] 세션에 화면공유 퍼블리셔 붙이기 전")
      await session.publish(screenSharingPublisher)
      console.log("4️⃣ [tracking] 세션에 화면공유 퍼블리셔 붙이기 완료")

      console.log("4 대성당 서브스크라이브 업데이트전")
      console.log("5️⃣ [tracking] 전체 서브스크라이브 업데이트 시도")
      setSubscribers(prevSubscribers => {
        console.log("5️⃣ [tracking] 전체 서브스크라이브 업데이트 중.")
        const newSubscribers = [...prevSubscribers]
        console.log("5️⃣ [tracking] 전체 서브스크라이브 업데이트 중..")
        return newSubscribers
      })
      console.log("5️⃣ [tracking] 전체 서브스크라이브 업데이트 완료..")
      
      // 배치 
      setPublisher((prevPublisher) => screenSharingPublisher)
      setMainStreamManager((prevMainStreamManager) => screenSharingPublisher)
      setIsScreenSharing((prevScreenSharing) => true)

    } catch (error) {

    }
  }, [session])

  const toggleSharingMode = useCallback((originPublish) => {
    if (isScreenSharing) {
      // 화면 공유 모드일 때, 카메라로 전환
      startCameraSharing(originPublish)
    } else {
      // 카메라 모드일 때, 화면 공유로 전환
      if(session.streamManagers.length>0){
        console.log("#️⃣ [tracking] 끼래기", session.streamManagers.length)
        startScreenSharing(originPublish)
      }else{
        console.log("#️⃣ [tracking] 끼래기", 0)
        setSession(()=>(originPublish.session))
        setIsRetry(true)
      }
    }
  }, [isScreenSharing, startCameraSharing, startScreenSharing, isChangedProperty])


  useEffect(()=>{
    if(isRetry){
      console.log("#️⃣ [tracking] 끼래기가 짧아서 재시도 한다.")
      toggleSharingMode(publisher)
      setIsRetry(false)
    }
  },[isRetry])

  useEffect(() => {
    if (session) {
      // 토큰받아오기
      getToken().then(async (response) => {
        try {
          await session.connect(response.data)

          // stream만들기 initPublisherAsync() 메소드는 스트림 생성 및 전송 담당를 초기화
          let publisher = await OV.current.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: audioEnabled,
            publishVideo: videoEnabled,
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false,
          })

          session.publish(publisher)

          const devices = await OV.current.getDevices()
          const videoDevices = devices.filter(device => device.kind === 'videoinput')
          const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId
          const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId)

          setMainStreamManager(publisher)
          setPublisher(publisher)
          setCurrentVideoDevice(currentVideoDevice)

          setSessionConnect(true)

        } catch (error) {
          // console.log('There was an error connecting to the session:', error.code, error.message)
        }
      });
    }
  }, [session])

  const [isLeaved, setIsLeaved] = useState(false)

  const leaveSession = useCallback(() => {
    const leaveSessionMutationCall = () => {
      if (sessionInfo.isDirect) {
        leaveSessionMutation.mutate(openViduSession)
      } else {
        leaveSessionMutation.mutate(session.options.sessionId)
      }
    }
    // Leave the session
    if (session) {
      leaveSessionMutationCall()
    }
  }, [session])

  useEffect(() => {
    if (isLeaved) {
      if (session) {
        // 오픈비듀 세션 끊는 로직
        OV.current = new OpenVidu()
        setSession(undefined)
        setSubscribers([])
        setMySessionId(null)
        setMyUserName(null)
        setMainStreamManager(undefined)
        setPublisher(undefined)
        // 디스커넥션 널
        session.disconnect()
        navigate('/')
      }
    }
  }, [isLeaved])


  const deleteSubscriber = useCallback((streamManager) => {
    setSubscribers((prevSubscribers) => {
      const index = prevSubscribers.indexOf(streamManager)
      if (index > -1) {
        const newSubscribers = [...prevSubscribers]
        newSubscribers.splice(index, 1)
        return newSubscribers
      } else {
        return prevSubscribers
      }
    })
  }, [])

  //창이 닫힐때 세션 종료
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      leaveSession()
    };
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [leaveSession])

  const getToken = useCallback(async () => {
    if (sessionInfo.isDirect) {
      return createToken(sessionInfo.mySessionId)
    } else {
      return createSession(data).then(sessionId =>
        createToken(sessionId),
      )
    }
  }, [data])

  const createSession = async (data) => {
    // apiConfig 내 토큰 인스턴스 사용
    const response = await jwtInstance.post(APPLICATION_SERVER_URL + '/mogakko', data);
    setMySessionId(response.data.data.sessionId);
    setOpenViduSession(response.data.data.sessionId);
    return response.data.data.sessionId // The sessionId
  }

  const createToken = async (sessionId) => {
    if (sessionInfo) {
      if (sessionInfo.isDirect) {
        setMySessionId(sessionId) // 참가자
        setOpenViduSession(sessionId) // 참가자
      }
    } else {
      setMySessionId(sessionId) // 방장
    }
    // apiConfig 내 토큰 인스턴스 사용
    const response = await jwtInstance.post(APPLICATION_SERVER_URL + '/mogakko/' + sessionId, {})
    return response.data // The token
  };

  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// 실시간 채팅 ////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////

  const connect = (params) => {
    stompClient.current = new Client({
      connectHeaders: {
        ACCESS_KEY: `${getCookie('token')}`
      },
      debug: (debug) => {
        // console.log("debug : ", debug)
      },
      reconnectDelay: 0,

      heartbeatIncoming: 4000,

      heartbeatOutgoing: 4000,

      // 검증 부분
      webSocketFactory: () => {
        const socket = new SockJS("https://codingking.store/ws")
        socket.onopen = function () {
          socket.send(
            JSON.stringify({
              ACCESS_KEY: `${getCookie('token')}`
            })
          )
        }
        return socket
      },

      // 검증이 돼서 Room을 열어주는 서버랑 연결이 되면
      onConnect: (response) => {
        isConnected.current = true
        subscribe(params)
        publish(params)
      },

      onStompError: (frame) => {
        console.log("🆖 [tracking] 실시간 채팅 스톰프1", frame)
        console.log("🆖 [tracking] 실시간 채팅 스톰프2 " + frame.headers["message"])
        console.log("🆖 [tracking] 실시간 채팅 스톰프3 " + frame.body)
      },
      onWebSocketError: (frame) => {
        // console.log(frame)
      },
      onWebSocketClose: () => {
        // console.log("web socket closed")
      },
    })
    stompClient.current.activate()
  }


  const subscribe = (params) => {
    if (params) {
      stompClient.current.subscribe(
        `/sub/chat/room/${params}`,
        (data) => {
          const response = JSON.parse(data.body)
          if (response.type === 'TALK') {
            chatMessages.push(response)
            setChatMessages([...chatMessages])
          }
        }
      )
      setIsFisrstSubscribe(true)
    } else {
      setIsFisrstSubscribe(false)
    }

  }

  const publish = async (openViduSession) => {
    if (!stompClient.current.connected) {
      return
    }
    await stompClient.current.publish({
      destination: "/pub/chat/room",
      body: JSON.stringify({
        type: "ENTER",
        sessionId: openViduSession,
        nickname: sessionInfo.myUserName

      }),
      headers: { ACCESS_KEY: `${getCookie('token')}` },
    });
    setIsLoading(false)
  }

  const textPublish = (params) => {
    if (message !== "") {
      stompClient.current.publish({
        destination: "/pub/chat/room",
        body: JSON.stringify({
          type: "TALK",
          sessionId: params,
          nickname: sessionInfo.myUserName,
          message
        }),
        headers: { ACCESS_KEY: `${getCookie('token')}` }
      })
      setMessage("")
    }
  }

  // 스크롤이 항상 맨 아래로 가게하는 이벤트
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 사용자 비디오 슬라이드 
  const [position, setPosition] = useState(0);
  const [count, setCount] = useState(0)
  const scrollLeft = () => {
    setPosition((prevPosition) => prevPosition + 990); // 왼쪽으로 1045px 이동
    const newCount = count
    setCount(newCount - 1)
  }

  const scrollRight = () => {
    setPosition((prevPosition) => prevPosition - 990); // 오른쪽으로 1045px 이동
    const newCount = count
    setCount(newCount + 1)
  }

  // 스낵바 활성화 핸들러
  const activeSnackbarHandler = () => {
    setIsActiveSnackbar(true)
  }

  // 스낵바에 표현할 메세지 세팅
  const getFriendResponseMsgHandler = (res) => {
    setSnackbarMsg(res)
  }

  return (
    <div className="container">
      {/* 세션이 없으면  */}
      {session === undefined ? (
        <>
          <Header />
          <FlexCenter>
            <RoomCreateContainer>
              <RoomCreateWrap>
                <RoomCreateTitle> 모각코 만들기 </RoomCreateTitle>
                <form onSubmit={joinSession}>
                  <RoomNameWrap>
                    <RoomName>모각코 이름 </RoomName>
                    <RoomNameInput
                      type="text"
                      value={roomTitle}
                      onChange={handleChangeRoomTitle}
                      placeholder='어떤 모각코인지 설명해주세요. 15자 까지 입력 가능합니다.'
                      maxLength={15}
                      required
                    />
                  </RoomNameWrap>
                  <LanguageWrap>
                    <LanguageTitle>언어 </LanguageTitle>
                    <LanguageBtnWrap>
                      {
                        languageList.map((language, idx) => {
                          return (
                            <LanguageBtnBox>
                              <LanguageBtn isSelected={language.isSelected} onClick={(e) => {
                                e.preventDefault()
                                onClickLanguageHandler(idx, language.isSelected)
                              }} language={language.img} imgSeltedUrl={language.imgSeltedUrl} imgHoverUrl={language.imgHoverUrl} >{language.language}</LanguageBtn>
                              <span>{language.value}</span>
                            </LanguageBtnBox>
                          )
                        })
                      }
                    </LanguageBtnWrap>
                  </LanguageWrap>
                  <MaxMembersWrap>
                    <MaxMembersTitle>최대인원 </MaxMembersTitle>
                    <MaxMembersBtnWrap>
                      {
                        maxMembers.map((ele, idx) => {
                          return (
                            <MaxMembersBtn isSelected={ele.isSelected} key={idx} onClick={(e) => {
                              e.preventDefault()
                              maxMembersHandler(ele.num, ele.isSelected, idx)
                            }}>{ele.num}</MaxMembersBtn>
                          )
                        })
                      }
                    </MaxMembersBtnWrap>
                  </MaxMembersWrap>
                  <JoinBtnWrap>
                    <JoinBtn name="commit" type="submit" value="모각코 만들기" />
                  </JoinBtnWrap>
                </form>
              </RoomCreateWrap>
            </RoomCreateContainer>
          </FlexCenter>
        </>
      ) : null}
      {/* 세션이 있으면  */}
      {session !== undefined ? (
        <FlexCenterInSession>
          {
            !roomPopUp &&
            <Dark>
              <PopUp>
                <h1>모각코에 오신걸 환영합니다!</h1>
                <h3>
                  방에 들어가기에 앞서 <br />
                  몇 가지 주의사항을 기억해주세요!
                </h3>
                <RoomPopUpImgBox>
                  <img src={`${process.env.PUBLIC_URL}/image/RoomPopUpImg1.webp`} alt="주의 아이콘1" />
                  <p>
                    예티켓을 지켜주세요 <br />
                    우리 모두 함께하는 사람입니다. 부적절한 언행을 <br />
                    삼가해주세요.
                  </p>
                </RoomPopUpImgBox>

                <RoomPopUpImgBox style={{
                  marginRight: '7px',
                }}>
                  <img src={`${process.env.PUBLIC_URL}/image/RoomPopUpImg2.webp`} alt="주의 아이콘2" />
                  <p>
                    열심히 스터디에 참여해주세요<br />
                    모두 코딩 공부를 하기 위해 모인 사람들입니다.<br />
                    다른 업무는 지양해주세요.
                  </p>
                </RoomPopUpImgBox>
                <ParticipationBtn onClick={() => {
                  setRoomPopUp(!roomPopUp)
                }}>참여하기</ParticipationBtn>
              </PopUp>
            </Dark>
          }
          {
            isblocked &&
            <CommonPopup msg={`뒤로가기 하시겠습니까?`}
              secondMsg={'모각코 참여 시간을 기록하지'}
              thrMsg={'않으면 저장되지 않습니다.'}
              isBtns={true}
              priMsg='나가기'
              secMsg='머무르기'
              priHander={() => { leaveSession() }}
              secHandler={() => (setIsblocked(false))}
              closeHander={() => (setIsblocked(false))} />
          }
          {
            isBeforeLeave &&
            <>
              <CommonPopup msg={`나가시겠습니까?`}
                secondMsg={'모각코 참여 시간을 기록하지'}
                thrMsg={'않으면 저장되지 않습니다.'}
                isBtns={true}
                priMsg='나가기'
                secMsg='머무르기'
                priHander={() => { leaveSession() }}
                secHandler={() => (setIsBeforeLeave(false))}
                closeHander={() => (setIsBeforeLeave(false))} />
            </>
          }
          {
            /* 친구 신청 스낵바 */
            isActiveSnackbar ? (
              <>
                <SnackBar content={snackbarMsg} state={snackbarStatus} />
              </>
            ) : null
          }
          <RoomInHeader>
            <RoomHeaderContentWrap>
              {languageImgHandler()}
              <div>
                <span>{roomTitle}</span>
                <RoomHeaderBottomItemWrpa>
                  <p>언어: {data.language.charAt(0).toUpperCase() + data.language.slice(1).toLowerCase()}</p>
                  <p>정원: {subscribers.length + 1}/{data.maxMembers}</p>
                </RoomHeaderBottomItemWrpa>
              </div>
            </RoomHeaderContentWrap>
            <div>
              <LeaveBtn
                onClick={() => (leavePopOpenHandler())}
                //onClick={leaveSession}
                LeaveBtnImg={`${process.env.PUBLIC_URL}/image/roomLeaveBtn.webp`}
                LeaveBtnHoverImg={`${process.env.PUBLIC_URL}/image/leaveHover.webp`}
              />
            </div>
          </RoomInHeader>
          <RoomContainer>
            <VideoWrap>
              <PubilshSession>
                {publisher !== undefined ? (
                  <PubilsherVideoContainer>
                    {count === 1 && data.maxMembers >= 5 ?
                      <SlideLeftBtn onClick={() => { scrollLeft() }}
                        SlideLeft={`${process.env.PUBLIC_URL}/image/slideLeft.webp`}
                      ></SlideLeftBtn> :
                      <></>
                    }

                    <PubilsherVideoWrap onClick={() => handleMainVideoStream(publisher)} movePositon={position}>
                      {
                        publisher && <UserVideoComponent
                        streamManager={publisher}
                        activeSnackbarHandler={activeSnackbarHandler}
                        getFriendResponseMsgHandler={getFriendResponseMsgHandler}
                        getUserNicknameHandler={getUserNicknameHandler}
                        isSelf={true}
                      />
                      }
                      

                      {/* 구독자 수 만큼 비디오를 생성해서 붙인다. */}
                      {
                        subscribers && subscribers.map((e, i) => (
                          <div key={e.id} onClick={() => handleMainVideoStream(e)}>
                            <UserVideoComponent
                              streamManager={e}
                              activeSnackbarHandler={activeSnackbarHandler}
                              getFriendResponseMsgHandler={getFriendResponseMsgHandler}
                              getUserNicknameHandler={getUserNicknameHandler}
                              isSelf={false}
                            />
                          </div>
                        ))
                      }

                    </PubilsherVideoWrap>
                    {count === 0 && data.maxMembers >= 5 ?
                      <SlideRightBtn onClick={() => {
                        scrollRight()
                      }}
                        SlideRight={`${process.env.PUBLIC_URL}/image/slideRight.webp`}
                      ></SlideRightBtn> :
                      null
                    }
                  </PubilsherVideoContainer>
                ) : null}


                {/* <MainStreamWrap>
                    <UserVideoComponent streamManager={mainStreamManager} />
                  </MainStreamWrap> */}
                {mainStreamManager !== undefined ? (
                  <MainStreamWrap>
                    {
                      !codeEditor ? 
                      <UserVideoComponent streamManager={mainStreamManager} isSelf={true}/> :
                      <CodeEditor code={code} language={data.language.toLowerCase()} onChange={handleCodeChange} />
                    }
                  </MainStreamWrap>
                ) : null}

              </PubilshSession>

              {sessionConnect &&
                <VideoBtnWrap>
                  <StopwatchWrap>
                    <Stopwatch isBeforeLeave={isBeforeLeave} />
                  </StopwatchWrap>
                  <VideoToggleBtn
                    onClick={VideoTogglehandler}
                    VideoOffBtn={`${process.env.PUBLIC_URL}/image/VideoOff.webp`}
                    VideoOnBtn={`${process.env.PUBLIC_URL}/image/VideoOn.webp`}
                    VideoHoverBtn={`${process.env.PUBLIC_URL}/image/videoHover.webp`}
                    VideoOnHoverBtn={`${process.env.PUBLIC_URL}/image/videoOnHover.webp`}
                    VideoEnabled={videoEnabled}
                  />
                  <AudioToggleBtn
                    onClick={AudioTogglehandler}
                    AudioOffBtn={`${process.env.PUBLIC_URL}/image/microphoneOff.webp`}
                    AudioOnBtn={`${process.env.PUBLIC_URL}/image/microphoneOn.webp`}
                    AudioHoverBtn={`${process.env.PUBLIC_URL}/image/microphoneHover.webp`}
                    AudioOnHoverBtn={`${process.env.PUBLIC_URL}/image/mcOnHover.webp`}
                    AudioEnabled={audioEnabled}
                  />
                  <VideoShareBtn
                    onClick={() => { toggleSharingMode(publisher) }}
                    ShareOffBtn={`${process.env.PUBLIC_URL}/image/ShareOn.webp`}
                    ShareOnBtn={`${process.env.PUBLIC_URL}/image/ShareOff.webp`}
                    ShareHoverBtn={`${process.env.PUBLIC_URL}/image/ShareHover.webp`}
                    ShareOnHoverBtn={`${process.env.PUBLIC_URL}/image/screenOnHover.webp`}
                    isScreenSharing={isScreenSharing}
                  >
                  </VideoShareBtn>
                  <CodeEditorToggleBtn
                    onClick={() => { codeEditorToggleHandler() }}
                    codeOffBtn={`${process.env.PUBLIC_URL}/image/codeOn.webp`}
                    codeOnBtn={`${process.env.PUBLIC_URL}/image/codeOff.webp`}
                    codeHoverBtn={`${process.env.PUBLIC_URL}/image/codeOffHover.webp`}
                    codeOnHoverBtn={`${process.env.PUBLIC_URL}/image/codeOnHover.webp`}
                    codeEditor={codeEditor}
                  >
                  </CodeEditorToggleBtn>
                </VideoBtnWrap>
              }
            </VideoWrap>
            <ChattingWrap>
              <ChattingHeader>채팅</ChattingHeader>
              <ChatContentWrap>
                {chatMessages
                  .map((data, idx) =>
                    data.nickname === getCookie('nickName') ? (
                      <MyChatWrap key={idx}>
                        {/* <WrittenTime>{data.createdAt}</WrittenTime> */}
                        <MyNickName>{data.nickname}</MyNickName>
                        <MyChat>{data.message}</MyChat>
                      </MyChatWrap>
                    ) : (
                      <YourChatWrap key={idx}>
                        <YourNickName>{data.nickname}</YourNickName>
                        <YourChat>{data.message}</YourChat>
                        {/* <WrittenTime>{data.createdAt}</WrittenTime> */}
                      </YourChatWrap>
                    )
                  )}
                <div ref={messagesEndRef} />
              </ChatContentWrap>
              <ChatInputWrap>
                <ChatInputBox>
                  <ChatInput
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    cols="30"
                    rows="4"
                    placeholder='대화를 입력하세요.'
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (e.shiftKey) {
                          return;
                        } else if (message.trim() === '') {
                          e.preventDefault();
                          return;
                        } else if (!e.nativeEvent.isComposing) {
                          e.preventDefault();
                          textPublish(openViduSession ? openViduSession : mySessionId);
                        }
                      }
                    }}
                  ></ChatInput>
                </ChatInputBox>
              </ChatInputWrap>
              <SendBtnWrap>
                <SendBtn onClick={() => {
                  if (message.trim() !== '') {
                    textPublish(openViduSession ? openViduSession : mySessionId)
                  }
                }}
                  send={`${process.env.PUBLIC_URL}/image/sendMessage.webp`}
                ></SendBtn>
              </SendBtnWrap>
            </ChattingWrap>
          </RoomContainer>
        </FlexCenterInSession>
      ) : null}
      {reportPopup && <ReportPopup nickname={getUserNickname} closeHander={closeReportPopupHandler} reportMsgHandler={getReportMsgHandler} />}
      {
        reportSnackBar &&
        <SnackBar content={reportMsg} statue={reportSnackBar} />
      }
    </div>
  );
}

export const RoomHeaderContentWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

export const RoomHeaderBottomItemWrpa = styled.div`
  display: flex;
  gap: 12px;

  p {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    color: #FFFFFF;
  }
`

export const UserNickName = styled.span`
    color: white;
    font-size: 12px;
    position: absolute;
    left: 0;
    bottom: 4px;
    background: rgba(0, 0, 0, 0.59);
    border-bottom-left-radius: 10px;
    border-top-right-radius: 10px;
    padding-top: 5px;
    padding-bottom: 3px;
    padding-inline: 10px;
`

export const Dark = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0,0.6);
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
`

export const PopUp = styled.div`
  position: relative;
  width: 384px;
  height: 424px;
  background: var(--bg-li);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  h1 {
    width: 100%;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    color: var(--po-de);
    text-align: center;
    margin-top: 50px;
    margin-bottom: 20px;
  }

  h3 {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    color: var(--po-de);
    text-align: center;
    line-height: 148.52%;
    margin-bottom: 30px;
  }
`

export const RoomPopUpImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  gap: 11px;
  margin-bottom: 20px;
  img {
    width: 28px;
  }

  p {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 172.02%;
    color: #FFFFFF;
  }
`

export const ParticipationBtn = styled.button`
  width: 164px;
  height: 32px;
  background: var(--po-de);
  border-radius: 359px;
  border: none;
  transition: all 0.3s;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  color: #464646;
  &:hover {
    background: #00C5D1;
  }
  margin-bottom: 34px;
`

export const FlexCenter = styled.div`
  width: 1280px;
  height: 935px;
  /* 화면 차지하기 추가 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100vh - 79px);
`
export const FlexCenterInSession = styled.div`
  /* height: 100vh; */
`

export const RoomCreateContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 50px 0 50px 0;
  box-sizing: border-box;
  height: 935px;
`

export const RoomCreateWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  padding: 80px 50px 50px 50px;
  border-radius: 8px;
`

export const RoomCreateTitle = styled.div`
  font-size: 36px;
  margin-bottom: 60px;
  color: white;
  font-weight: 700;
  font-family: 'Pretendard';
`

export const RoomNameWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 60px;
`

export const RoomName = styled.label`
  width: 150px;
  font-size: 21px;
  color: white;
`

export const RoomNameInput = styled.input`
  margin-left: 10px;
  width: 100%;
  height: 40px;
  padding: 10px 10px 10px 15px;
  outline: none;
  border: none;
  background-color: var(--bg-li);
  border-radius: 114px;
  color : #FFFFFF;
  &::placeholder{
    color: #BEBEBE;
  }
`

export const LanguageWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 60px;
`

export const LanguageTitle = styled.p`
  width: 130px;
  font-size: 21px;
  margin-bottom: 15px;
  color: white;
`

export const LanguageBtnWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap:16px;
`

export const LanguageBtnBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  span {
    color: white;
    font-weight: 700;
    font-size: 12px;
  }
`

export const LanguageBtn = styled.button`
  width: 57px;
  height: 57px;
  background: transparent;
  border-radius: 50%;  
  border: none;
  font-size: 0;
  background-image: url(
    ${(props) => {
    return props.isSelected ? props.imgSeltedUrl : props.language;
  }});
  background-repeat: no-repeat;
  background-size: cover;
  &:hover {
    background-image: url(
      ${(props) => {
    return props.imgHoverUrl
  }}
    );
  }
`

export const MaxMembersWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 60px;
`

export const MaxMembersTitle = styled.p`
  width: 130px;
  font-size: 21px;
  margin-bottom: 15px;
  color: white;
`

export const MaxMembersBtnWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
`


export const MaxMembersBtn = styled.button`
  width: 125px;
  height: 48px;
  border-radius: 114px;
  /* background-color: transparent; */
  background-color: ${(props) => {
    return props.isSelected ? 'var(--po-de)' : 'transparent';
  }};
  color: ${(props) => {
    return props.isSelected ? '#464646' : '#FFFFFF';
  }};
  border: 1px solid white;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  //0617주석 line-height: 150%;
`

export const PublicWrap = styled.div`
  margin-bottom: 40px;
  display: flex;
  align-items: center;
`

export const PublicTitle = styled.p`
  width: 130px;
  font-size: 21px;
  margin-bottom: 15px;
  color: white;
`

export const PublicBtnWrap = styled.div`
  display: flex;
  gap: 20px;
`

export const PublicBtn = styled.button`
  width: 200px;
  height: 50px;

  color: ${({ btnSelect }) =>
    btnSelect === 'public' ? '#464646' : '#FFFFFF'
  };

  background-color: ${({ btnSelect }) =>
    btnSelect === 'public' ? 'var(--po-de)' : 'transparent'
  };
  border: 2px solid white;
  border-radius: 114px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  //0617주석 line-height: 150%;
  text-align: center;
`

export const ClosedBtn = styled.button`
  width: 200px;
  height: 50px;

  color: ${({ btnSelect }) =>
    btnSelect === 'closed' ? '#464646' : '#FFFFFF'
  };

  background-color: ${({ btnSelect }) =>
    btnSelect === 'closed' ? 'var(--po-de)' : 'transparent'
  };
  border: 2px solid white;
  
  border-radius: 114px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  //0617주석 line-height: 150%;
  text-align: center;
`

export const PasswordWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`

export const PasswordInputWrap = styled.div`
  display: flex;
  margin-bottom: 14px;
`

export const PasswordTitle = styled.p`
  width: 130px;
  font-size: 14px;
  margin-top: 10px;
  color: white;
`

export const PasswordInput = styled.input`
  margin-left: 10px;
  width: 589px;
  height: 40px;
  padding: 10px 10px 10px 15px;
  outline: none;
  border: none;
  background-color: var(--bg-li);
  border-radius: 114px;
  &::placeholder{
    color: #BEBEBE;
  }
`

export const JoinBtnWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  
`

export const JoinBtn = styled.input`
  width: 200px;
  height: 60px;
  padding: 10px 0 10px 0;
  background: var(--po-de);
  border-radius: 52px;
  font-weight: 700;
  font-size: 22px;
  color: #464646;
  border: none;
  cursor: pointer;
  
  //0617주석 line-height: 73%;
  font-family: 'Pretendard';
  font-style: normal;
`

export const RoomInHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90px;
  padding: 0 27px 0 31px;

  span {
    color: white;
    font-size: 22px;
  }
`

export const LeaveBtn = styled.button`
  width: 38px;
  height: 38px;
  border: none;
  background-image: url(
    ${(props) => {
    return props.LeaveBtnImg
  }}
  );
  background-color: transparent;
  background-size: cover;
  background-repeat: no-repeat;
  transition: all 0.3s;
  &:hover {
    background-image: url(
      ${(props) => {
    return props.LeaveBtnHoverImg
  }}
    );
  }
`
export const RoomContainer = styled.div`
  width: 100%;
  height: 845px;
  display: flex;
  /* justify-content: space-between; */
  justify-content: flex-start;
  gap: 9px;
  height: calc(100vh - 90px);
`

export const VideoWrap = styled.div`
  width: 100%;
  width: 981px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const PubilshSession = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
`

export const PubilsherVideoContainer = styled.div`
  padding: 5px;
  display: flex;
  gap: 10px;
  overflow: hidden;
  position: relative;
  /* width: 1030px; */
  width: 985px;
  scroll-snap-type: x mandatory;
`

export const PubilsherVideoWrap = styled.div` 
  width: 2000px;
  height: 145px;
  border-radius: 10px;
  display: flex;
  flex-shrink: 0;
  justify-content: flex-start;
  align-items: center;
  gap: 7px;
  scroll-snap-align: start;
  scroll-behavior: smooth;
  /* background-color: yellow; */
  transition: transform 0.5s ease;
  transform: translateX(
    ${(props) => {
    return props.movePositon + 'px'
  }}
  );
  video {
      min-width: 240px;
      max-width: 240px;
      height: 135px;
  }
`

export const SlideLeftBtn = styled.button`
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  width: 20px;
  height: 52px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 5px;
  z-index: 4;
  background-image: url(
    ${(props) => {
    return props.SlideLeft;
  }});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
`

export const SlideRightBtn = styled.button`
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  width: 20px;
  height: 52px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  z-index: 4;
  background-image: url(
    ${(props) => {
    return props.SlideRight;
  }});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
`


export const MainStreamWrap = styled.div`
  width: 1030px;
  width: 981px;
  display: flex;
  justify-content: center;
  video {
    height: 550px;
    height: 528px;
  }

  span {
    font-size: 15px;
  }

  img {
    display: none;
  }
`


export const VideoBtnWrap = styled.div`
  height: 80px;
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
`

export const StopwatchWrap = styled.div`
  position: absolute;
  left: 30px;
  top: 10px;
`

export const VideoShareBtn = styled.button`
  width: 98px;
  height: 60px;
  border: none;
  background-color: transparent;
  background-image: url(
    ${(props) => {
    return props.isScreenSharing ? props.ShareOnBtn : props.ShareOffBtn
  }}
  );
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.3s;
  &:hover{
  background-image: url(
    ${(props) => {
    return props.isScreenSharing ? props.ShareHoverBtn : props.ShareOnHoverBtn
  }}
    );
  }
`

export const VideoToggleBtn = styled.button`
  width: 98px;
  height: 60px;
  border: none;
  background-color: transparent;
  background-image: url(
    ${(props) => {
    return props.VideoEnabled ? props.VideoOnBtn : props.VideoOffBtn
  }}
  );
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.3s;
  &:hover{
  background-image: url(
    ${(props) => {
    return props.VideoEnabled ? props.VideoHoverBtn : props.VideoOnHoverBtn
  }}
  );
  }
`

export const AudioToggleBtn = styled.button`
  width: 98px;
  height: 60px;
  border: none;
  background-color: transparent;
  background-image: url(
    ${(props) => {
    return props.AudioEnabled ? props.AudioOnBtn : props.AudioOffBtn
  }}
  );
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.3s;
  &:hover{
  background-image: url(
    ${(props) => {
    return props.AudioEnabled ? props.AudioHoverBtn : props.AudioOnHoverBtn
  }}
  );
  }
`

export const CodeEditorToggleBtn = styled.button`
  width: 98px;
  height: 60px;
  border: none;
  background-color: transparent;
  background-image: url(
    ${(props) => {
    return props.codeEditor ? props.codeOnBtn : props.codeOffBtn
  }}
  );
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.3s;
  &:hover{
  background-image: url(
    ${(props) => {
    return props.codeEditor ? props.codeHoverBtn : props.codeOnHoverBtn
  }}
  );
  }
`

export const ChattingWrap = styled.div`
  width: 300px;
  width: 274px;
  /* height: 840px; */
  position: relative;
  background-color: var(--bg-li);
  border-radius: 10px;
  height: calc(100vh - 90px - 10px);
  min-height: 778px;
`

export const ChattingHeader = styled.p`
  font-size: 20px;
  height: 55px;
  padding-left: 29px;
  box-sizing: border-box;
  color:white;
  display: flex;
  align-items: center;
`

export const ChatContentWrap = styled.div`
    padding: 10px 15px;
    height: calc(100% - 55px - 76px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
    position: relative;
`;

export const MyNickName = styled.p`
  font-size: 11px;
  padding-right: 2px;
  color: white;
`

const YourChatWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 5px;
    margin-block: 15px;
`;

export const YourNickName = styled.p`
  font-size: 11px;
  color: white;
`

const YourChat = styled.pre`
    max-width: 180px;
    background-color: #616670;
    border-radius: 8px;
    font-size: 14px;
    text-align: start;
    line-height: 20px;
    padding: 5px 10px;
    word-wrap: break-word;
    white-space: pre-wrap;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
`;

const MyChatWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: end;
    gap: 5px;
    margin-block: 15px;
`;

const MyChat = styled.pre`
    max-width: 180px;
    background-color: #E2E2E2;
    border-radius: 8px;
    font-size: 14px;
    text-align: start;
    line-height: 20px;
    padding: 5px 10px;
    word-wrap: break-word;
    white-space: pre-wrap;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
`;

export const ChatInputWrap = styled.div`
  text-align: center;
`

export const ChatInputBox = styled.div`
  position: absolute;
  left: 13px;
  bottom: 12px;
  /* width: 190px;
  height: 76px; */
  /* padding: 5px 13px; */
  box-sizing: border-box;
  background-color: #626873;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  width: 217px;
  height: 76px;

`

export const ChatInput = styled.textarea`
    /* position: absolute;
    left: 13px;
    bottom: 12px; */
    width: 182px;
    height: 57px;
    background-color: #626873;
    /* padding: 5px 10px; */
    letter-spacing: 1.5px;
    resize: none;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 500;
    overflow-y: hidden;
    &::-webkit-scrollbar {
        display: none;
    }
    outline: none;
    border: none;
    font-family: 'Pretendard';
    font-style: normal;
    color: white;
    &::placeholder {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      /* line-height: 23px; */
      color: #BEBEBE;
    }
`;

export const SendBtnWrap = styled.div`
    position: absolute;
    bottom: 10px;
    right: 6px;
    cursor: pointer;
    padding: 6px;
    box-sizing: border-box;
`;

export const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
  100% { transform: translateX(0); }
`;

export const SendBtn = styled.button`
  width: 18px;
  height: 18px;
  border: none;
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: cover;
    background-image: url(
    ${(props) => {
    return props.send
  }}
  );
  transition: all 0.3s;
  &:hover {
    animation: ${shakeAnimation} 0.6s;
  }
`

export default Room