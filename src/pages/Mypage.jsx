
import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getProfile, addProfile, getFriendList, getFriendRequestList, reciveFriendRequest, deleteFriend, githubIdPost, searchUser, receiveMessage, postMessage, sentMessage, requestFriend } from '../axios/api/mypage'
import styled from 'styled-components';
import Header from "../components/common/Header";
import useInput from '../hooks/useInput'
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../cookie/Cookie';
import ChartLan from '../components/ChartLan';
import ChartTimes from '../components/ChartTimes';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ChartWeekly from '../components/ChartWeekly';
import CommonPopup from '../components/common/CommonPopup'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// // 00:00:00 to 00H00M
// const formatTime = (timeString) => {
//   console.log("formatting 전 timeString > ", timeString)
//   const time = new Date(`2000-01-01T${timeString}`);
//   const hours = time.getHours();
//   const minutes = time.getMinutes();
//   const formattedHours = hours < 10 ? `0${hours}` : hours;
//   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//   return `${formattedHours}H${formattedMinutes}M`;
// }

// 쪽지 컴포넌트화
const MakeNoteHandler = ({ idx, nickName, content, createdAt }) => {
  const [isToggle, setIsToggle] = useState(false)
  const toggleChangerHandler = (toggle) => {
    setIsToggle(!toggle)
    // console.log('토글토글톧글톧글톧글톧글톧글톧글톧글톧글톧글톧글톧글톧글톧글톧글톧글톧글톧글톧글,', isToggle)
  }
  return (
    <>
      <ReceiveMessageWrap key={idx} onClick={() => (toggleChangerHandler(isToggle))} isRead={isToggle}>
        <ReceiveSendNickname>{nickName}</ReceiveSendNickname>
        <ReceiveContent isRead={isToggle}>{content}</ReceiveContent>
        <ReceiveCreatedAt>{createdAt}</ReceiveCreatedAt>
      </ReceiveMessageWrap>
    </>
  )
}

function Mypage() {

  // AOS init설정
  useEffect(() => {
    AOS.init();
  })

  const getFriendListIsSuccessHandler = () => {
    // console.log('친구목록 조회 성공', friendListData)
  }
  const getFriendListIsErrorHandler = () => {
    // console.log('친구목록 조회 실패', friendListData)
    setFriendList([])
  }

  // 유저검색 쿼리 활성화 여부
  const [isSearchUserEnabled, setIsSearchUserEnabled] = useState(false)
  const [searchUserParam, setSearchUserParam] = useState(undefined)

  //유저 검색 성공 함수
  const getSearchUserListIsSuccessHandler = (response) => {
    //console.log("유저 검색 성공",response)
    setIsSearchUserEnabled(false)
  }

  //유저 검색 실패 함수
  const getSearchUserListIsErrorHandler = () => {
    //console.log("유저 검색 실패")
    setSearchFriend([])
    setIsSearchUserEnabled(false)
  }

  // query
  const queryClient = useQueryClient()
  const { isLoading: isProfileLoading, isError: isProfileError, data: profileData } = useQuery("getProfile", getProfile)

  const { isLoading: isFriendListLoading, isError: isFriendListError, data: friendListData } = useQuery("getFriendList", getFriendList, {
    refetchOnMount: false,
    onSuccess: getFriendListIsSuccessHandler,
    onError: getFriendListIsErrorHandler,
    retry: false
  })

  const { isLoading: isFriendRequestListLoading, isError: isFriendRequestListError, data: friendRequestListData } = useQuery("getFriendRequestList", getFriendRequestList)

  const { isLoading: isSearchUserListLoading, isError: isSearchUserListError, data: searchUserListData } = useQuery(
    "getSearchUserList", () => (searchUser(searchUserParam))
    , {
      enabled: isSearchUserEnabled,
      onSuccess: getSearchUserListIsSuccessHandler,
      onError: getSearchUserListIsErrorHandler,
      retry:false,
    })

  // 받은 쪽지 조회
  const { isLoading: isReceiveMessageLoading, isError: isReceiveMessageError, data: receiveMessageData } = useQuery("getReceiveMessage", receiveMessage)

  //받은 쪽지 State
  const [myReceiveMessage, setMyReceiveMessage] = useState(null)

  // 보낸 쪽지 조회
  const { isLoading: isSentMessageLoading, isError: isSentMessageError, data: sentMessageData } = useQuery("getSentMessage", sentMessage)

  //보낸 쪽지 State
  const [mysentMessage, setMySentMessage] = useState(null)
  const [friendList, setFriendList] = useState([]) // 친구목록
  const [friendListDelete, setFriendListDelete] = useState(false) // 친구 삭제 버튼 활성화 여부
  const [statusonMouse, setStatusOnMouse] = useState(false)
  const [temponMouse, setTempOnMouse] = useState(false)
  const [value, setValue] = useState(0)
  const [gitHub, setGitHub] = useState(false)
  const [userGitHubId, setuserGitHubId] = useState('')

  // 프로필 이미지 수정 관련 내부 스테이트
  const [fileAttach, setFileAttach] = useState('')
  const [preview, setPreview] = useState(profileData && profileData.data.data.member.profileImage)
  const [isFileModify, setIsFileModify] = useState(false)

  // custom hooks
  const [githubValue, onChangeGithubValue, githubInputValueReset] = useInput('')


  // MOGAKKO-DATA 컴포넌트 
  const [mogakkoData, setmogakkoData] = useState(true)

  // 친구 컴포넌트
  const [friendSidebar, setFriendSidebar] = useState(false)

  // 찾은친구 
  const [searchFriend, setSearchFriend] = useState([])

  // 쪽지 컴폰너트
  const [messageSidebar, setMessageSidebar] = useState(false)
  // 쪽지 받은쪽지/보낸쪽지 sidebar 구분
  const [messageBox, setMessageBox] = useState({
    receive: true,
    send: false
  })

  // 쪽지 모달 on/off
  const [postPopup, setPostPopup] = useState(false)

  // 파일 업로드 에러 팝업 오픈
  const [isFileCommonPopupOpend, setIsFileCommonPopupOpend] = useState(false)

  const [receiveUserValue, onChangeReceiveUser, receiveUserReset] = useInput('')
  const [receiveContentValue, onChangeReceiveContent, receiveContentReset] = useInput('')


  // 친구요청 대기중 버튼 
  const [friendRequestPendingList, setFriendRequestPendingList] = useState([]);

  // 친구 요청 성공 모달
  const [friendReqSuc, setFriendReqSuc] = useState(false)

  // hooks
  const navigate = useNavigate()

  const inputRef = useRef()

  // 친구찾기 닉네임 OR CODE구분
  const [friendFindNickName, setFriendFindNickName] = useState(true)
  const [friendFindCode, setFriendFindCode] = useState(false)

  // 친구찾기 useInput
  const [findNickNameValue, onChangeFindNickNameValue, findNickNameValueReset] = useInput('')
  const [findCodeValue, onChangeFindCodeValue, findCodeValueReset] = useInput('')


  // 쪽지 status에 따른 팝업 state
  const [messageStatus, setMessageStatus] = useState(false)
  const [mesageStatusresponse, setMesageStatusresponse] = useState('')

  // 쪽지 200자 초과 막기 팝업 
  const [messageBlock, setmessageBlock] = useState(false)


  // 쪽지 보내기 Mutation
  const postMessageMutation = useMutation(postMessage, {
    onSuccess: (response) => {
      queryClient.invalidateQueries(receiveMessage)
    },
    onError: (error) => {
      console.log("po", error)
      popupOpenHander(error.response.data.message)
      setPostPopup(true)
      // console.log('error.response.data.message', error.response.data.message)
    }
  })

   // 요청 응답 공통 팝업 오픈
  const popupOpenHander = (msg) => {
    // console.log('쪽지팝업 msg is......0', msg)
    setMesageStatusresponse(msg)
    // console.log('쪽지팝업 mesageStatusresponse', mesageStatusresponse)
    // console.log('쪽지팝업 messageStatus', messageStatus)
  }

  // 요청 응답 공통 팝업 클로즈
  const popupCloseHander = () => {
    setMessageStatus(false)
    setMesageStatusresponse('')
  }

  useEffect(() => {
    // console.log('쪽지팝업', mesageStatusresponse)
    if (mesageStatusresponse !== '') {
      //console.log('쪽지팝업 msg is......1', mesageStatusresponse)
      if(mesageStatusresponse !== 'AccessToken Expired.'){
        setMessageStatus(true)
      }
    }else {
      
      setMessageStatus(false)
    }
  }, [mesageStatusresponse]);


  const postMessageHandler = () => {
    postMessageMutation.mutate({
      messageReceiverNickname: receiveUserValue,
      content: receiveContentValue
    })

  }

  //유저검색 내용 입력 useEffect
  useEffect(() => {
    if (findNickNameValue !== '' || findCodeValue !== '') {
      if (friendFindNickName) {
        setSearchUserParam(()=>({ type: 'NAME', value: findNickNameValue }))
        findCodeValueReset()
      } else {
        setSearchUserParam(()=>({ type: 'CODE', value: findCodeValue }))
        findNickNameValueReset()
      }
    }
  }, [findNickNameValue, findCodeValue])

  // 유저 검색어 세팅 함수
  const settingSearchUserHandler = () => {
    //console.log('검색어 세팅', findNickNameValue)
    setIsSearchUserEnabled(true)
  }


  //유저 검색 useEffect
  useEffect(() => {
    if (searchUserListData) {
      //console.log("유저검색 1111111", searchUserListData.data.data)
      setSearchFriend(searchUserListData.data.data)
    }
  }, [searchUserListData])

  useEffect(() => {
    if (profileData) {
      // console.log("마이페이지 조회 결과", profileData)
      // console.log("마이페이지 조회 결과-profileImage", profileData.data.data.member.profileImage)
      // console.log("마이페이지 조회 결과-nickname", profileData.data.data.member.nickname)

      setCookie('userProfile', profileData.data.data.member.profileImage)
      setPreview(profileData.data.data.member.profileImage)
      setuserGitHubId(profileData.data.data.member.githubId)
      setMyReceiveMessage(receiveMessageData && receiveMessageData.data.data)
      setMySentMessage(sentMessageData && sentMessageData.data.data)
    }
  }, [profileData])

  // 친구목록 조회 useEffect
  useEffect(() => {
    if (friendListData) {
      // console.log("친구목록 조회 1", friendListData)
      //console.log("친구목록 조회 2", friendListData.data.data)
      if (friendListData.data.data) {
        setFriendList(friendListData.data.data)
      } else {
        setFriendList([])
      }
    }
  }, [friendListData])

  // 친구요청 목록 조회 useEffect
  useEffect(() => {
    if (friendRequestListData) {
      // console.log("친구요청목록 조회 1", friendRequestListData)
      //console.log("친구요청목록 조회 2", friendRequestListData.data.data)
    }
  }, [friendRequestListData])

  // MY 코딩온도 애니메이션 useEffect
  useEffect(() => {
    setValue(profileData && profileData.data.data.member.codingTem)
    const interval = setInterval(() => {
      if (value < profileData) {
        setValue((prevValue) => prevValue + 1)
      }
    }, 10);

    return () => {
      clearInterval(interval);
    }
  }, [profileData])

  // 프로필 수정 useEffect
  useEffect(() => {
    // console.log('프로필 이미지 수정 핸들러 실행 0', fileAttach)
    if (fileAttach) {
      const maxSize = 2 * 1024 * 1024
      // console.log('프로필 이미지 수정 핸들러 실행 1', fileAttach.size, ",", maxSize)
      if (fileAttach.size > maxSize) {
        setIsFileCommonPopupOpend(true)
        handleClearInput()
        setFileAttach('')
      } else {
        const objectUrl = URL.createObjectURL(fileAttach)
        setPreview(objectUrl)
        setIsFileModify(true)
        setIsFileCommonPopupOpend(false)
      }
    }
  }, [fileAttach])


  // 수정이 완료되면
  useEffect(() => {
    if (isFileModify) {
      submitImgHandler()
    } else {
      setFileAttach('')
    }
  }, [isFileModify])

  // 프로필 썸네일 useEffect
  useEffect(() => {
    // 프로필 이미지가 기본 이미지일때는 랜덤 프로필 사진 보여줌. 등록했을 경우에는 등록된 이미지 파일 보여줌
    if (preview) {
      if (preview === 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtArY0iIz1b6rGdZ6xkSegyALtWQKBjupKJQ&usqp=CAU') {
        // console.log("기본 프로필 입니다. 랜덤프로필 작업 필요")
        const avataGen = `https://source.boringavatars.com/beam/120/${profileData.data.data.member.nickname}?colors=00F0FF,172435,394254,EAEBED,F9F9FA`
        setPreview(avataGen)
      } else {
        // console.log("유저가 프로필을 등록한 사용자입니다.", preview)
      }
    }
  }, [preview])

  // 친구 삭제 뮤테이션
  const deleteFriendMutation = useMutation(deleteFriend, {
    onSuccess: (response) => {
      // console.log("친구 삭제 성공", response)
      queryClient.invalidateQueries(getProfile)
      queryClient.invalidateQueries(getFriendList)
      queryClient.invalidateQueries(getFriendRequestList)
    },
  })

  // githubId 등록 뮤테이션
  const githubMutation = useMutation(githubIdPost, {
    onSuccess: (response) => {
      queryClient.invalidateQueries(getProfile)
    },
  })

  // 프로필 사진 수정 뮤테이션
  const filemutation = useMutation(addProfile, {
    onSuccess: (response) => {
      // console.log("프로필 사진 수정 성공", response)
      queryClient.invalidateQueries(getProfile)
      queryClient.invalidateQueries(getFriendList)
      queryClient.invalidateQueries(getFriendRequestList)
    },
  })

  // 친구 수락/거절
  const reciveFriendMutation = useMutation(reciveFriendRequest, {
    onSuccess: (response) => {
      // console.log("친구 신청 수락/거절", response)
      queryClient.invalidateQueries(getProfile)
      queryClient.invalidateQueries(getFriendList)
      queryClient.invalidateQueries(getFriendRequestList)
    },
  })

  // 친구 삭제 버튼 핸들러
  const friendListDeleteHandler = () => {
    setFriendListDelete(!friendListDelete)
    const updateFriendList = friendList.map((friend, index) => {
      return { ...friend, selected: false }
    })
    setFriendList(updateFriendList)
  }

  // 친구 요청 수락/취소 버튼 클릭 핸들러
  const onClickRequestFriendButtonHandler = (targetNickName, isAccept) => {
    // console.log("친구 요청을 해준 닉네임", targetNickName)
    // console.log("(친구요청?) 수락 거부", isAccept)
    const target = { requestSenderNickname: targetNickName, determineRequest: isAccept }
    reciveFriendMutation.mutate(target)
  }

  // 친구 삭제 여러건 선택 핸들러
  const onClickDeleteFriendCheckHandler = (targetNickName, idx, isSelected) => {
    // console.log("삭제하기 위해 선택한 친구 닉네임", targetNickName)
    // console.log("삭제하기 위해 선택한 친구 인덱스", idx)
    // console.log("삭제하기 위해 선택한 친구 선택여부", isSelected)
    const updateFriendList = friendList.map((friend, index) => {
      if (index === idx) {
        return { ...friend, selected: !isSelected }
      } else {
        return friend
      }
    })
    setFriendList(updateFriendList)
  }

  // 친구 삭제 버튼 클릭 핸들러
  const onClickDeleteFriendButtonHandler = () => {
    const deleteFriendList = friendList.filter((friend) => friend.selected).map((friend) => friend.member.nickname)
    // console.log("삭제할 친구 목록", deleteFriendList)
    deleteFriendMutation.mutate(deleteFriendList)
  }

  // 친구 추가 보내기
  const friendRequetMutation = useMutation(requestFriend, {
    onSuccess: (response) => {
      // console.log(">>> 친구 추가 보내기 성공", response.data.message)
      // 쿼리다시조회
      settingSearchUserHandler()
    },
  })

  // 친구 추가 핸들러
  const onClickRqFriendshipBtnHandler = (target, idx) => {
    // console.log("나랑 친구할래?", target)
    friendRequetMutation.mutate(target)
    setFriendRequestPendingList((prevList) => [...prevList, idx])
  }

  // 파일 수정 핸들러
  const handleFileChange = (event) => {
    // console.log("프로필 이미지 수정 핸들러 실행 inputChangeHandler", event)
    setFileAttach(event.target.files[0])
  }

  const handleClearInput = () => {
    inputRef.current.value = ''
  }



  // 프로필 이미지 저장 핸들러 - onchange 랑 onClick이랑 동시에 동작하면 왜 온클릭이 무시될까요? 일단 바꿈 
  const submitImgHandler = () => {
    // console.log("프로필 이미지 전송 핸들러 실행")
    const newFile = new FormData();
    newFile.append("imageFile", fileAttach)
    filemutation.mutate(newFile)
    setIsFileModify(false)
  }

  //githubID 저장 핸들러
  const githubIdHandler = () => {
    githubMutation.mutate(githubValue)
  }

  // 아바타 생성 핸들러
  const avataGenHandler = (url, userNickName) => {
    let avataGen
    const nickName = userNickName
    const profilceImage = url
    if (profilceImage === 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtArY0iIz1b6rGdZ6xkSegyALtWQKBjupKJQ&usqp=CAU') {
      avataGen = `https://source.boringavatars.com/beam/120/${nickName}?colors=00F0FF,172435,394254,EAEBED,F9F9FA`
    } else {
      avataGen = profilceImage
    }
    return avataGen
  }

  // 물음표 버튼 hover시 나오는 정보창 (status) 핸들러
  const statusOnMouseHandler = () => {
    setStatusOnMouse(true)
  }
  const statusOffMouseHandler = () => {
    setStatusOnMouse(false)
  }

  // 물음표 버튼 hover시 나오는 정보창 (온도) 핸들러
  const tempOnMouseHandler = () => {
    setTempOnMouse(true)
  }
  const tempOffMouseHandler = () => {
    setTempOnMouse(false)
  }

  // 다른 유저 프로필 클릭 핸들러
  const userProfileHandler = (id) => {
    navigate('/profile/' + id)
  }


  // 코드 복사 
  const myCode = profileData && profileData.data.data.member.friendCode

  const messageBlockHandler = () => {
    if (receiveContentValue.length <= 200) {
      postMessageHandler()
      receiveUserReset()
      receiveContentReset()
      setPostPopup(!postPopup)
    } else if (receiveContentValue.length > 200) {
      setmessageBlock(true)
    } else {
      setMessageStatus(true)
    }
  }

  const messageBlockCloseHandler = () => {
    setmessageBlock(false)
  }

  return (
    <>
      {
        isFileCommonPopupOpend ?
          <><CommonPopup msg={'크기가 2MB 이하인 이미지'} secondMsg={'파일을 선택해 주시기 바랍니다.'} isBtns={false} priMsg={'닫기'} priHander={() => (setIsFileCommonPopupOpend(false))} closeHander={() => (setIsFileCommonPopupOpend(false))} /></> : <></>
      }
      <>
        <Header />
        {
          gitHub &&
          <Dark>
            <PopUp>
              <CloseBtn onClick={() => {
                setGitHub(!gitHub)
                githubInputValueReset()
              }}
                closeBtn={`${process.env.PUBLIC_URL}/image/PopUpCloseBtn.webp`}
              ></CloseBtn>
              <h1>깃허브 닉네임</h1>
              <p>깃허브 닉네임을 등록해주세요.</p>
              <input type="text" placeholder='아이디' value={githubValue} onChange={onChangeGithubValue} />
              <GitHubBtn onClick={() => {
                setGitHub(!gitHub)
                // setuserGitHubId(githubValue)
                githubIdHandler()
                githubInputValueReset()
              }}>확인</GitHubBtn>
            </PopUp>
          </Dark>
        }
        <FlexBox>
          <MypageWrap>
            <MypageNavbar>
              <ProfileModifyContent encType="multipart/form-data" onSubmit={(e) => { e.preventDefault() }}>
                <ImageWrap BgImg={preview} />
                <div>
                  <FileButton htmlFor="file"
                    modify={`${process.env.PUBLIC_URL}/image/modifyBtn.webp`}
                    modifyClick={`${process.env.PUBLIC_URL}/image/modifyClickBtn.webp`}
                  ></FileButton>
                  <FileInput type="file" id="file" onChange={handleFileChange} ref={inputRef} accept="image/*" />
                </div>
              </ProfileModifyContent>
              <MyPageUserName>{profileData && profileData.data.data.member.nickname}</MyPageUserName>

              <MyCodeWrap>
                <MyCode>나의 코드: {profileData && profileData.data.data.member.friendCode}</MyCode>
                <CopyToClipboard text={myCode} onCopy={() => alert("클립보드에 복사되었습니다.")}>
                  <CopyBtn
                    imgUrl={`${process.env.PUBLIC_URL}/image/copyBtn.webp`}
                  ></CopyBtn>
                </CopyToClipboard>
              </MyCodeWrap>

              <NavberCategory>
                <DataCategory mogakkoData={mogakkoData}
                  onClick={() => {
                    setmogakkoData(true)
                    setFriendSidebar(false)
                    setMessageSidebar(false)
                    setMessageBox({
                      receive: true,
                      send: false
                    })
                  }}
                >모각코 데이터</DataCategory>
                <FriendCategory friendSidebar={friendSidebar}
                  onClick={() => {
                    setmogakkoData(false)
                    setFriendSidebar(true)
                    setMessageSidebar(false)
                    setMessageBox({
                      receive: true,
                      send: false
                    })
                  }}
                >친구</FriendCategory>
                <Message messageSidebar={messageSidebar}
                  onClick={() => {
                    setmogakkoData(false)
                    setFriendSidebar(false)
                    setMessageSidebar(true)
                  }}
                >쪽지</Message>
                {messageSidebar &&
                  <ul>
                    <ReceiveBox
                      receive={messageBox.receive}
                      data-aos="slide-down"
                      onClick={() => {
                        setMessageBox({
                          receive: true,
                          send: false
                        })
                      }}
                    >받은 쪽지함</ReceiveBox>
                    <SendBox
                      send={messageBox.send}
                      data-aos="slide-down"
                      data-aos-delay="100"
                      onClick={() => {
                        setMessageBox({
                          receive: false,
                          send: true
                        })
                      }}
                    >보낸 쪽지함</SendBox>
                  </ul>
                }
              </NavberCategory>

            </MypageNavbar>
            {mogakkoData &&
              <WidthBox>
                <MyPageTopContentWrap>
                  <MogakkoTitle>모각코 데이터</MogakkoTitle>
                  <ProfileModifyWrap>

                    <TotalTimewrap>
                      <TopContentTitle>오늘 공부시간</TopContentTitle>
                      <TopContentTitleItem>{profileData && profileData.data.data.timeOfWeek.today}</TopContentTitleItem>
                    </TotalTimewrap>

                    <WeeklyTimeWrap>
                      <TopContentTitle>총 공부 시간</TopContentTitle>
                      <TopContentTitleItem>{profileData && profileData.data.data.timeOfWeek.weekTotal}</TopContentTitleItem>
                    </WeeklyTimeWrap>
                    <Temperaturecontainer>
                      <TemperatureTitle>ON°
                        <img
                          src={`${process.env.PUBLIC_URL}/image/status.webp`}
                          onMouseEnter={() => {
                            tempOnMouseHandler()
                          }}
                          onMouseLeave={() => {
                            tempOffMouseHandler()
                          }}
                        ></img>
                      </TemperatureTitle>
                      {
                        temponMouse &&
                        <TemperatureMouseHoverBox>
                          <TemperatureMouseHoverBoxdesc>
                            당신의 코딩온도는 몇도인가요?<br />
                            공부 시간이 늘어날수록<br />
                            코딩 온도도 올라가요! ( 10M <img src={`${process.env.PUBLIC_URL}/image/enterArrow.webp`} alt="화살표 아이콘" /> 0.01)
                          </TemperatureMouseHoverBoxdesc>
                        </TemperatureMouseHoverBox>
                      }
                      <TemperatureWrap>
                        <ProgressContainer>
                          <Progress style={{ width: `${value}%` }} />
                        </ProgressContainer>
                        <span>{profileData && profileData.data.data.member.codingTem}°</span>
                      </TemperatureWrap>
                    </Temperaturecontainer>

                    <StatusWrap>
                      <TopContentTitleWrap>
                        <TopContentTitle>상태코드</TopContentTitle>
                        <Status
                          statusImg={`${process.env.PUBLIC_URL}/image/status.webp`}
                          onMouseEnter={() => {
                            statusOnMouseHandler()
                          }}
                          onMouseLeave={() => {
                            statusOffMouseHandler()
                          }}
                        ></Status>
                        {
                          statusonMouse &&
                          <StatusMouseHoverBox>
                            <p>102 : <span>회원가입 시 기본값</span></p>
                            <p>200 : <span>처음 프로필 등록시 변경</span></p>
                            <p>109 : <span>모각코 시간 1시간 9분 경과</span></p>
                            <p>486 : <span>모각코 시간 4시간 8분 6초 경과</span></p>
                            <p>1004 : <span>모각코 시간 10시간 4분 경과</span></p>
                            <p>2514 : <span>모각코 시간 25시간 14분 경과</span></p>
                          </StatusMouseHoverBox>
                        }
                      </TopContentTitleWrap>
                      <TopContentTitleItem>{profileData && profileData.data.data.member.memberStatusCode}</TopContentTitleItem>
                    </StatusWrap>
                  </ProfileModifyWrap>
                </MyPageTopContentWrap>

                <ChartWrap>
                  <WeeklyStudyTimewrap>
                    <p>이번 주 공부시간</p>
                    <AttendanceCheckWrap data-aos="fade-down" data-aos-duration="1000">
                      <ChartWeekly data={profileData && profileData.data.data.timeOfWeek} />
                    </AttendanceCheckWrap>
                    <StudyTime data-aos="fade-right" data-aos-duration="1000">
                      <ChartTimes data={profileData && profileData.data.data.timeOfWeek} />
                    </StudyTime>
                  </WeeklyStudyTimewrap>
                  <TotalLanguageWrap>
                    <p>통합 선택 언어</p>
                    <TotalLanguage data-aos="fade-left" data-aos-duration="1000">
                      <ChartLan data={profileData && profileData.data.data.languageList} />
                    </TotalLanguage>
                  </TotalLanguageWrap>
                </ChartWrap>

                <MyPageMiddleContentWrap>
                  {/* <div><p>깃허브 잔디</p><img src={`${process.env.PUBLIC_URL}/image/enterArrow.webp`} alt="화살표 아이콘" /></div> */}
                  <GithubTitleWrap userGitHubId={userGitHubId}>
                    <p>GitHub</p>
                    {userGitHubId === null || userGitHubId === undefined || userGitHubId === ' ' ?
                      null :
                      <GithubModifyImg
                        modify={`${process.env.PUBLIC_URL}/image/gitHubEdit.png`}
                        modifyHo={`${process.env.PUBLIC_URL}/image/gitHubEdit.pngp`}
                        modifyClcik={`${process.env.PUBLIC_URL}/image/gitHubEdit.png`}
                        onClick={() => {
                          setGitHub(!gitHub)
                        }}
                      >
                      </GithubModifyImg>
                    }
                  </GithubTitleWrap>

                  {
                    userGitHubId ?
                      <MyPageMiddleContent>
                        <GitHubImage src={`https://ghchart.rshah.org/232B3D/${userGitHubId}`} />
                      </MyPageMiddleContent> :
                      <NoGithubIdWrap onClick={() => {
                        setGitHub(!gitHub)
                      }}>
                        <div><img src={`${process.env.PUBLIC_URL}/image/addSquare.png`} alt="깃허브잔디등록버튼" /></div>
                        <p>깃허브 잔디를 등록해보세요</p>
                      </NoGithubIdWrap>
                  }
                </MyPageMiddleContentWrap>
              </WidthBox>
            }

            {friendSidebar &&
              <FriendMypageWrap>
                <MyPageBottomContentWrap>
                  <FriendListContainer>
                    <DeleteBtnWrap>
                      <FriendListTitle>친구 목록</FriendListTitle>
                      {friendList.length === 0 ?
                        null :
                        <>
                          {
                            !friendListDelete ? <FriendListDeleteBtn onClick={() => {
                              friendListDeleteHandler()
                            }}>삭제 하기</FriendListDeleteBtn> :
                              <FriendListCancleBtnWrap>
                                <FriendListCancleBtn onClick={() => {
                                  friendListDeleteHandler()
                                }}
                                  color={'cancle'}
                                >취소</FriendListCancleBtn>
                                <FriendListCancleBtn onClick={onClickDeleteFriendButtonHandler}>삭제</FriendListCancleBtn>
                              </FriendListCancleBtnWrap>
                          }
                        </>
                      }
                    </DeleteBtnWrap>

                    {
                      friendList.length === 0 ?
                        <NullFriendList>
                          <img src={`${process.env.PUBLIC_URL}/image/emptyFriendList.webp`} alt="텅빈 리스트" />
                          <p>추가한 친구가 없습니다</p>
                          <p>닉네임이나 친구코드를 검색해 친구를 찾아보세요</p>
                        </NullFriendList> :
                        <ScrollWrap>
                          <FriendListWrap>
                            {friendList && friendList.map((friend, idx) => {
                              return (
                                <>
                                  <FriendList onClick={() => {
                                    onClickDeleteFriendCheckHandler(friend.member.nickname, idx, friend.selected)
                                    !friendListDelete && userProfileHandler(friend.member.id)
                                  }}>
                                    {
                                      friendListDelete &&
                                      <DeleteSelectedBtn selected={friend.selected}></DeleteSelectedBtn>
                                    }
                                    <FriendListImage friendListImg={avataGenHandler(friend.member.profileImage, friend.member.nickname)}></FriendListImage>
                                    <FriendListName>{friend.member.nickname}</FriendListName>

                                    <FriendListTemperaturecontainer>
                                      <FriendListTemperatureTitle>ON°</FriendListTemperatureTitle>
                                      <FriendListTemperatureWrap>
                                        <img src={`${process.env.PUBLIC_URL}/image/mannerTemp.webp`} />
                                        <FriendListProgressContainer>
                                          <FriendListProgress style={{ width: `${friend.member.codingTem}%` }} />
                                        </FriendListProgressContainer>
                                        <span>{friend.member.codingTem}°</span>
                                      </FriendListTemperatureWrap>
                                    </FriendListTemperaturecontainer>
                                  </FriendList>
                                </>
                              )
                            })}
                          </FriendListWrap>
                        </ScrollWrap>
                    }
                  </FriendListContainer>
                  <FriendMypageReqWrap>
                    <FriendRequestWrap>
                      <FriendRequestTitle>친구 요청</FriendRequestTitle>
                      {
                        friendRequestListData && !friendRequestListData.data.data ?
                          <NullFriendRequestList>
                            <h1>아직 친구 요청이 없습니다.</h1>
                          </NullFriendRequestList> :
                          <ReqScrollWrap>
                            {friendRequestListData && friendRequestListData.data.data.map((friend, idx) => {
                              return (
                                <>
                                  <FriendWrap>
                                    <FriendLeftContent onClick={() => {
                                      navigate('/profile/' + friend.id)
                                    }}>
                                      <FriendProfile friendRequestImg={avataGenHandler(friend.profileImage, friend.nickname)}></FriendProfile>
                                      <FriendRequestNickname>{friend.nickname}</FriendRequestNickname>
                                    </FriendLeftContent>
                                    <ButtonWrap>
                                      <AllowBtn onClick={() => { onClickRequestFriendButtonHandler(friend.nickname, true) }} color={'allow'}>수락</AllowBtn>
                                      <AllowBtn onClick={() => { onClickRequestFriendButtonHandler(friend.nickname, false) }}>거절</AllowBtn>
                                    </ButtonWrap>
                                  </FriendWrap>
                                </>
                              )

                            })
                            }
                          </ReqScrollWrap>
                      }
                    </FriendRequestWrap>

                    <FriendFindwrap>
                      <FriendFindTitleWrap>
                        <FriendFindTitle>친구 찾기</FriendFindTitle>
                        <FriendFindBtnWrap>
                          <FriendFindNickNameBtn
                            friendFindNickName={friendFindNickName}
                            onClick={() => {
                              setFriendFindNickName(true)
                              setFriendFindCode(false)
                            }}
                          >닉네임</FriendFindNickNameBtn>
                          <FriendFindCodeBtn
                            friendFindCode={friendFindCode}
                            onClick={() => {
                              setFriendFindNickName(false)
                              setFriendFindCode(true)
                            }}
                          >친구코드</FriendFindCodeBtn>
                        </FriendFindBtnWrap>

                      </FriendFindTitleWrap>
                      <FriendFindCodeInputWrap>
                        <img src={`${process.env.PUBLIC_URL}/image/zoomIcon.webp`} alt="" />
                        {friendFindNickName ?
                          <FriendFindNickNameInput
                            type="text"
                            placeholder='닉네임 입력'
                            value={findNickNameValue}
                            onChange={(e) => {
                              onChangeFindNickNameValue(e)
                            }}
                            onKeyDown={(e) => {
                              // 엔터시 검색 키워드 세팅
                              if (e.key === "Enter") { 
                                console.log("ENTERENTER")
                                  if (e.nativeEvent.isComposing === false && !e.shiftKey) {
                                      e.preventDefault()
                                      settingSearchUserHandler()
                                  }
                              }
                            }}
                          /> :

                          <FriendFindCodeInput
                            type="text"
                            placeholder='친구코드 입력'
                            value={findCodeValue}
                            onChange={(e) => {
                              onChangeFindCodeValue(e)
                            }}
                          />
                        }
                      </FriendFindCodeInputWrap>

                      <SearchScrollWrap>
                        {searchFriend && searchFriend?.map((e, idx) => {
                          return (
                            <FriendWrap>
                              <FriendSearchContentWrap onClick={() => {
                                navigate('/profile/' + e.id)
                              }}>
                                <FriendProfile friendRequestImg={avataGenHandler(e.profileImage, e.nickname)}></FriendProfile>
                                <FriendRequestNickname>{e.nickname}</FriendRequestNickname>
                              </FriendSearchContentWrap>
                              {/* {e.friend === false ? <FriendSearchBtn onClick={() => {
                                onClickRqFriendshipBtnHandler(e.nickname, idx)
                                setFriendReqSuc(!friendReqSuc)
                              }}>{isFriendRequestPending ? '대기중' : '친구신청'}</FriendSearchBtn> : null} */}
                              {
                                e.friend === true ? null : !e.pending ? <FriendSearchBtn onClick={() => {
                                  onClickRqFriendshipBtnHandler(e.nickname, idx)
                                  setFriendReqSuc(!friendReqSuc)
                                }}>친구신청</FriendSearchBtn> : <FriendReqWaitBtn>대기중</FriendReqWaitBtn>
                              }
                            </FriendWrap>
                          )
                        })
                        }
                      </SearchScrollWrap>
                    </FriendFindwrap>
                    {
                      friendReqSuc && <CommonPopup
                        msg={'친구신청 완료!!'}
                        secondMsg={'친구 수락을 기다려주세요.'}
                        isBtns={false}
                        priMsg={'확인'}
                        priHander={() => setFriendReqSuc(!friendReqSuc)}
                        closeHander={() => setFriendReqSuc(!friendReqSuc)} />
                    }
                  </FriendMypageReqWrap>
                </MyPageBottomContentWrap >
              </FriendMypageWrap>
            }

            {
              postPopup &&
              <Dark>
                <MessagePopup>
                  <CloseBtn onClick={() => {
                    receiveUserReset()
                    receiveContentReset()
                    setPostPopup(!postPopup)
                  }}
                    closeBtn={`${process.env.PUBLIC_URL}/image/PopUpCloseBtn.webp`}
                  ></CloseBtn>
                  <h1>쪽지 쓰기</h1>
                  <h2>받는 사람</h2>
                  <input
                    type="text"
                    placeholder='닉네임 혹은 코드 입력'
                    value={receiveUserValue}
                    onChange={(e) => {
                      onChangeReceiveUser(e)
                    }}
                  />
                  <textarea
                    cols="30"
                    rows="10"
                    value={receiveContentValue}
                    onChange={(e) => {
                      onChangeReceiveContent(e)
                    }}
                    maxLength={199}
                  />

                  <MessagePopupBtnWrap>
                    <MessagePopupTextLength textLength={receiveContentValue.length}>{receiveContentValue.length} / 200자</MessagePopupTextLength>
                    <button onClick={() => {
                      messageBlockHandler()
                    }}>보내기</button>
                  </MessagePopupBtnWrap>
                </MessagePopup>
              </Dark>
            }

            {messageSidebar &&
              <MessageReceiveMypageWrap>
                <MessageReceiveMypageHeaderWrap>
                  <p>{messageBox.receive ? '받은 쪽지함' : '보낸 쪽지함'}</p>
                  <button onClick={() => {
                    setPostPopup(!postPopup)
                  }}>쪽지쓰기</button>
                </MessageReceiveMypageHeaderWrap>

                <MessageReceiveMypageTitleWrap>
                  <MessageReceiveMypageTitleLeft>
                    <p>{messageBox.send ? '받는 사람' : '보낸 사람'}</p>
                    <p>내용</p>
                  </MessageReceiveMypageTitleLeft>
                  <p>날짜</p>
                </MessageReceiveMypageTitleWrap>

                {
                  messageStatus ?
                    <CommonPopup msg={mesageStatusresponse} isBtns={false} priMsg={'확인'} priHander={popupCloseHander} closeHander={popupCloseHander} />
                    : <></>
                }
                {
                  messageBlock ?
                    <CommonPopup msg={'200자가 초과되어'} secondMsg={'쪽지 전송에 실패하였습니다.'} isBtns={false} priMsg={'확인'} priHander={messageBlockCloseHandler} closeHander={messageBlockCloseHandler} />
                    : <></>
                }
                <MessageScroll>
                  {messageSidebar === true && messageBox.receive === true ? (
                    receiveMessageData && receiveMessageData.data.data?.slice().reverse().map((e, idx) => (
                      <MakeNoteHandler idx={idx} nickName={e.senderNickname} content={e.content} createdAt={e.createdAt} />
                      // <ReceiveMessageWrap
                      //   key={idx}
                      //   onClick={() => {}}
                      //   isRead={false}
                      // >
                      //   <ReceiveSendNickname>{e.senderNickname}</ReceiveSendNickname>
                      //   <ReceiveContent>{e.content}</ReceiveContent>
                      //   <ReceiveCreatedAt>{e.createdAt}</ReceiveCreatedAt>
                      // </ReceiveMessageWrap>
                    ))
                  ) : null}

                  {/* 보낸쪽지함 */}
                  {messageSidebar === true && messageBox.send === true ? (
                    sentMessageData && sentMessageData.data.data?.slice().reverse().map((e, idx) => (
                      <MakeNoteHandler idx={idx} nickName={e.receiverNickname} content={e.content} createdAt={e.createdAt} />
                      // makeNoteHandler(idx, e.receiverNickname, e.content, e.createdAt)
                      // <ReceiveMessageWrap
                      //   key={idx}
                      //   onClick={() => {}}
                      //   isRead={false}
                      // >
                      //   <ReceiveSendNickname>{e.receiverNickname}</ReceiveSendNickname>
                      //   <ReceiveContent>{e.content}</ReceiveContent>
                      //   <ReceiveCreatedAt>{e.createdAt}</ReceiveCreatedAt>
                      // </ReceiveMessageWrap>
                    ))
                  ) : null}
                </MessageScroll>
              </MessageReceiveMypageWrap>
            }
          </MypageWrap>
        </FlexBox>
      </>
    </>
  )
}

const FlexBox = styled.div`
  display:flex;
  justify-content: center;
  align-items:center;
  height: calc(100vh - 79px);
`

const Dark = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0,0.6);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
`

const PopUp = styled.div`
  position: relative;
  width: 332px;
  height: 243px;
  background: var(--bg-li);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    width: 100%;
    font-weight: 600;
    font-size: 24px;
    color: white;
    text-align: start;
    padding-left: 35px;
    margin-bottom: 10px;
  }
  p {
    font-weight: 400;
    font-size: 14px;
    color: white;
    text-align: center;
    margin-bottom: 10px;
  }

  input {
    width: 267px;
    height: 30px; 
    background: #626873;
    border-radius: 114px;
    border: none;
    padding-left: 10px;
    outline: none;
    &::placeholder{
      color: #BEBEBE;
    }
    margin-bottom: 30px;
    color: #FFFFFF;
    font-family: 'Pretendard';
  }
`

const GitHubBtn = styled.button`
  width: 164px;
  height: 32px;
  background: var(--po-de);
  border-radius: 359px;
  border: none;
  transition: all 0.3s;
  font-weight: 700;
  font-size: 15px;
  color: #464646;
  &:hover {
    background: #00C5D1;
  }
`

const CloseBtn = styled.button`
  width: 13px;
  height: 13px;
  position: absolute;
  top: 21px;
  right: 24px;
  font-size: 25px;
  border: none;
  background-color: transparent;
  background-image: ${(props) =>
    `url(${props.closeBtn})`
  };
  background-position: center;
  background-size:cover;
`

const MyPageTopContentWrap = styled.div`
  height: 175px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`

const MogakkoTitle = styled.p`
  width: 100%;
  color: #FFFFFF;
  text-align: start;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 29px;
  margin-bottom: 10px;
`

const ProfileModifyWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const ProfileModifyContent = styled.form`
  position: relative;
`

const MyPageUserNameWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 25px;
  color: white;
`

const MyPageUserName = styled.p`
  width: 100%;
  font-size: 26px;
  color: white; 
  margin-top: 26px;
  font-family: 'Pretendard';
`

const Temperaturecontainer = styled.div`
  width: 207px;
  height: 108px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 17px;
`

const TemperatureTitle = styled.p`
    width: 136.72px;
    font-size: 17px;
    color: var(--po-de);
    font-weight: 900;
    text-align: start;
    img {
      margin-left: 5px;
      margin-bottom: 2px;
    }
`

const TemperatureMouseHoverBox = styled.div`
  position: absolute;
  top: 45px;
  right: -20px;
  width: 250px;
  height: 80px;
  background-color: #F9F9FA;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 8px;
  text-align: center;
  line-height: 22px;
`

const TemperatureMouseHoverBoxdesc = styled.p`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  color: #464646;

  img {
    width: 9px;
  }
`

const TemperatureWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  span {
    font-size: 14px;
    color: var(--po-de);
  }
  height: 33px;
`

const ProgressContainer = styled.div`
  width: 100px;
  height: 8px;
  margin-top: 2px;
  background:transparent;
  border-radius: 33px;
  border: 1px solid white;
`;

const Progress = styled.div`
  height: 100%;
  border-radius:10px;
  background: var(--po-de);
  transition: width 1s ease;
  border: none;
`;


const ImageWrap = styled.div`
  width: 133px;
  height: 133px;
  border-radius: 50%;
  background-image: ${(props) =>
    `url('${props.BgImg}')`
  };
  background-position:center;
  background-size:contain;
  background-color : white;
  background-repeat: no-repeat;
  border: 2px solid white;
  box-sizing:border-box;
`

const FileButton = styled.label`
  display: inline-block;
  color: black;
  cursor: pointer;
  width: 32.46px;
  height: 33.27px;
  box-sizing: border-box;
  border-radius: 50%;
  position: absolute;
  right: 2px;
  bottom: 7px;
  transition: all 0.3s;
  background-image: url(
    ${(props) => {
    return props.modify
  }}
  );
  background-position: center;
  border: 1px solid white;
  &:hover{
    background-image: url(
      ${(props) => {
    return props.modifyClick
  }}
    );
  }
`;

const FileInput = styled.input.attrs({ type: "file" })`
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
`;

const TimerWrap = styled.div`
  width: 550px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 70px;
`

const TotalTimewrap = styled.div`
  width: 207px;
  height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const WeeklyTimeWrap = styled.div`
  width: 207px;
  height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StatusWrap = styled.div`
  width: 207px;
  height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TopContentTitleWrap = styled.div`
  display: flex;
  /* align-items: center; */
  gap: 10px;
  position: relative;
`

const TopContentTitle = styled.p`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: var(--po-de);
  margin-bottom: 17px;
` 

const Status = styled.span`
  width: 18px;
  height: 18px;
  background-image: url(
      ${(props) => {
    return props.statusImg
  }}
  );
  background-repeat: no-repeat;
`

const TopContentTitleItem = styled.h1`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  color: white;
`

const StatusMouseHoverBox = styled.div`
  position: absolute;
  right: 0px;
  bottom: -155px;
  width: 215px;
  height: 160px;
  background: #F9F9FA;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
  z-index: 3;
  p {
    font-weight: 900;
    font-size: 11px;
    color: #464646;
    margin-bottom: 7px;
  }

  span {
    font-weight: 700;
    font-size: 9px;
    color: #464646;
  }
`

const MyPageMiddleContentWrap = styled.div`
  width: 893px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  p {
    width: 1020px;
    color: white;
    font-weight: 500;
    font-size: 21px;
    margin-bottom: 10px;
  }
`

const GithubTitleWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 7px;
  box-sizing: border-box;
  p {
    width: ${(props) => {
    return props.userGitHubId === null || props.userGitHubId === undefined || props.userGitHubId === ' ' ? '895px' : '863px'
  }};
  }
`

const GithubModifyImg = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 50%;
  transition: all 0.3s;
  cursor: pointer;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(
        ${(props) => {
    return props.modify
  }});
  background-color: transparent;
  /* &:hover {
      background-image: url(
          ${(props) => {
    return props.modifyHo
  }});
  } */
  /* &:active {
    background-image: url(
          ${(props) => {
    return props.modifyClcik
  }});
  } */
  &:hover {
    background-color: #68707C;
  }
  &:active {
    background-color: #3E4957;
  }

  
`

const MyPageMiddleContent = styled.div`
  background-color: white;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 8px;
`

const NoGithubIdWrap = styled.div`
  width: 893px;
  height: 160px;
  background: var(--bg-li);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img{
    margin-bottom: 20px;
  }

  p {
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 17px;
    line-height: 20px;
    text-align: center;
    color: #BEBEBE;
    text-align: center;
  }
`

const GitHubImage = styled.img`
  width: 996px;
`

const MyPageBottomContentWrap = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FriendRequestWrap = styled.div`
  width: 249px;
  box-sizing: border-box;
  border-radius: 8px;
`

const NullFriendRequestList = styled.div`
  width: 249px;
  height: 248px;
  background: var(--bg-li);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    color: #BEBEBE;
  }
`

const FriendRequestTitle = styled.p`
  font-weight: 500;
  font-size: 21px;
  color: white;
  margin-bottom: 10px;
`

const FriendRequestNickname = styled.p`
    font-weight: 500;
    font-size: 13px;
    width: 98px;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const FriendWrap = styled.div`
  width: 249px;
  height: 69px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`

const FriendLeftContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

const FriendProfile = styled.div`
  width: 37.31px;
  height: 37.31px;
  border-radius: 50%;
  background-image: ${(props) =>
    `url('${props.friendRequestImg}')`
  };
  background-position:center;
  background-size:contain;
  background-color : #D9D9D9;
  background-color: #ffffff;
  box-shadow: 0 0 0 1px #ffffff;
`

const ButtonWrap = styled.div`
  display: flex;
  gap: 10px;
`

const AllowBtn = styled.button`
  width: 49.44px;
  height: 23.77px;
  background-color: ${(props) => {
    return props.color === 'allow' ? 'var(--po-de)' : '#626873'
  }};
  border: none;
  /* padding: 8px; */
  border-radius: 14px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  transition: all 0.3s;
  color: ${(props) => {
    return props.color === 'allow' ? '#464646' : '#FFFFFF'
  }};
  &:hover{
    background-color: ${(props) => {
    return props.color === 'allow' ? '#00C5D1' : '#3E4957'
  }};
  }
`

const FriendListContainer = styled.div`
  width: 559px;
  height: 799px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`

const FriendListTitle = styled.p`
    color: white;
    font-weight: 500;
    font-size: 18px;
    width: 98px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const DeleteBtnWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  p {
    font-weight: 500;
    font-size: 21px;
  }
`

export const FriendListDeleteBtn = styled.button`
    background-color: transparent;
    border: 1px solid white;
    color: white;
    padding: 5px 8px 5px 8px;
    font-size: 12px;
    border-radius: 26px;
    transition: all 0.3s;

    &:hover{
      background-color: #3E4957;
    }
`

export const FriendListCancleBtnWrap = styled.div`
  display: flex;
  gap: 10px;
`

export const FriendListCancleBtn = styled.button`
  width: 43px;
  height: 25px;
  background-color: ${(props) => {
    return props.color === 'cancle' ? '#626873' : 'var(--po-de)'
  }};
  color: ${(props) => {
    return props.color === 'cancle' ? '#FFFFFF' : '#464646'
  }};
  border-radius: 26px;
  border: none;
  &:hover{
    background-color: ${(props) => {
    return props.color === 'cancle' ? '#3E4957' : '#00C5D1'
  }};
  }
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
`

const ScrollWrap = styled.div`
  width: 559px;
  height: 856px;
  overflow-y: scroll;
  
  &::-webkit-scrollbar{
      width: 7px;
      background-color: transparent;
      border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
      /* width: 10px; */
      height: 10%; 
      background-color: white;
      border-radius: 10px;
      height: 30px;
  }

  &::-webkit-scrollbar-track {
      background-color: #626873;
      border-left: 2px solid transparent;
      border-right: 2px solid transparent;
      background-clip: padding-box;
  }
`

const FriendListTemperaturecontainer = styled.div`
  width: 166px;
  height: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const FriendListTemperatureTitle = styled.p`
    width: 145px;
    height: 20px;
    font-size: 9px;
    color: var(--po-de);
    font-weight: 900;
    text-align: start;
`

const FriendListTemperatureWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  span {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 7px;
    color: #FFFFFF;
  }
`

const FriendListProgressContainer = styled.div`
  width: 100px;
  height: 8px;
  margin-top: 2px;
  background:transparent;
  border-radius: 33px;
  border: 1px solid white;
`;

const FriendListProgress = styled.div`
  height: 100%;
  border-radius:10px;
  background: var(--po-de);
  transition: width 1s ease;
  border: none;
`;

const ReqScrollWrap = styled.div`
  width: 281px;
  height: 248px;
  overflow-y: scroll;
  
  &::-webkit-scrollbar{
      width: 7px;
      background-color: transparent;
      border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
      /* width: 10px; */
      height: 10%; 
      background-color: white;
      border-radius: 10px;
      height: 30px;
  }

  &::-webkit-scrollbar-track {
      background-color: #626873;
      border-left: 2px solid transparent;
      border-right: 2px solid transparent;
      background-clip: padding-box;
  }
`

const FriendListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const NullFriendList = styled.div`
  width: 559px;
  height: 799px;
  background: var(--bg-li);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    margin-bottom: 16px;
  }

  p {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 31px;
    color: #BEBEBE;
  }
`

const FriendList = styled.div`
  width: 166.01px;
  height: 205.12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap:10px;
  border-radius: 10px;
  margin-top: 10px;
  transition: all 0.3s;
  position: relative;
  &:hover{
    background: var(--bg-li);
  }
`

const DeleteSelectedBtn = styled.button`
  width: 14px;
  height: 14px;
  background-color: transparent;
  position: absolute;
  top: 5px;
  left: 5px;
  border: 1px solid white;
  border-radius: 50%;
  background-color: ${(props) => {
    return props.selected ? '#00C5D1' : 'transparent'
  }};
`

const FriendListImage = styled.div`
  width: 86.54px;
  height: 85.1px;
  border-radius: 50%;
  background-image: ${(props) =>
    `url('${props.friendListImg}')`
  };
  background-position:center;
  background-size:contain;
  /* background-color : #D9D9D9; */
  background-color: #ffffff;
  box-shadow: 0 0 0 1px rgb(255, 255, 255, 0.2);
`

const FriendListName = styled.p`
  color: white;
`

const WidthBox = styled.div`
  width: 893px;
`

const MypageWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MypageNavbar = styled.div`
  width: 240px;
  height: 800px;
  background: var(--bg-li);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  margin-right: 66px;
  padding: 39px 0 0 0;
`

const MyCodeWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
  margin-bottom: 30px;
`

const MyCode = styled.p`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #BEBEBE;
`

const CopyBtn = styled.button`
  width: 12px;
  height: 12px;
  font-size: 0;
  background-color: transparent;
  border: none;
  background-image: ${(props) =>
    `url(${props.imgUrl})`
  };
`

const NavberCategory = styled.ul`
  width: 240px;
  height: 82px;
`

const DataCategory = styled.li`
  width: 240px;
  height: 82px;
  background-color: ${(props) => {
    return props.mogakkoData ? '#3E4957' : 'transparent'
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  color: #FFFFFF;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #3E4957;
  }
`

const FriendCategory = styled.li`
  width: 240px;
  height: 82px;
  background-color: ${(props) => {
    return props.friendSidebar ? '#3E4957' : 'transparent'
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  color: #FFFFFF;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #3E4957;
  }
`

const Message = styled.li`
    width: 240px;
    height: 82px;
    background-color: ${(props) => {
    return props.messageSidebar ? '#3E4957' : 'transparent'
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  color: #FFFFFF;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #3E4957;
  }
`

const ReceiveBox = styled.li`
  width: 240px;
  height: 46px;
  background-color: ${(props) => {
    return props.receive ? '#2F3B49' : 'transparent'
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s;
`

const SendBox = styled.li`
  width: 240px;
  height: 46px;
  background-color: ${(props) => {
    return props.send ? '#2F3B49' : 'transparent'
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s;
`


const ChartWrap = styled.div`
  width: 100%;
  height: 376px;
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  margin-bottom: 24px;
`

const WeeklyStudyTimewrap = styled.div`
  width: 486px;
  color: white;

  p{
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
    margin-bottom: 17px;
  }
`

const AttendanceCheckWrap = styled.div`
  width: 486px;
  height: 126px;
  background-color: var(--bg-li);
  
  /* background-color: transparent; */
  /* margin-bottom: 18px; */
`

const StudyTime = styled.div`
  width: 486px;
  height: 183px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-li);
  /* background-color: transparent; */
  padding-bottom: 10px;
  height: 201px;
`

const TotalLanguageWrap = styled.div`
  width: 384px;
  color: white;
  p{
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
    margin-bottom: 17px;
  }
`

const TotalLanguage = styled.div`
  width: 384px;
  height: 327px;
  background-color: var(--bg-li);
  /* background-color: transparent; */
`

const FriendMypageWrap = styled.div`
  width: 893px;
`

const FriendMypageReqWrap = styled.div`
  height: 799px;
  margin-left: 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 66px;
`

const FriendFindwrap = styled.div`
  width: 249px;
  height: 480px;
`

const FriendFindTitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FriendFindTitle = styled.p`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: #FFFFFF;
`

const FriendFindBtnWrap = styled.div`

`

const FriendFindNickNameBtn = styled.button`
  width: 48px;
  height: 24px;
  border: 1px solid ${(props) => {
    return props.friendFindNickName ? '#00F0FF' : '#4A4F59'
  }};
  background-color: transparent;
  color: ${(props) => {
    return props.friendFindNickName ? '#00F0FF' : '#BEBEBE'
  }};
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  margin-right: 1px;
`

const FriendFindCodeBtn = styled.button`
  width: 48px;
  height: 24px;
  border: 1px solid ${(props) => {
    return props.friendFindCode ? '#00F0FF' : '#4A4F59'
  }};
  background-color: transparent;
  color: ${(props) => {
    return props.friendFindCode ? '#00F0FF' : '#BEBEBE'
  }};
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
`

const FriendFindCodeInputWrap = styled.div`
  position: relative;

  img {
    width: 19.02px;
    height: 19.02px;
    position: absolute;
    top: 25px;
    left: 15px;
  }
`

const FriendFindNickNameInput = styled.input`
  width: 249px;
  height: 38px;
  background: var(--bg-li);
  border-radius: 108.396px;
  border: none;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  padding-left: 44px;
  margin-top: 15px;
  outline: none;
  color: #ffffff;
`

const FriendFindCodeInput = styled.input`
  width: 249px;
  height: 38px;
  background-color: var(--bg-li);
  border-radius: 108.396px;
  border: none;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  padding-left: 44px;
  margin-top: 15px;
  outline: none;
  color: #ffffff;
`

const MessageReceiveMypageWrap = styled.div`
    width: 893px;
    height: 799px; 
`

const MessageReceiveMypageHeaderWrap = styled.div`
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px;

  p {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 29px;
    line-height: 35px;
    color: #FFFFFF;
  }

  button {
    width: 88px;
    height: 34px;
    background: #00F0FF;
    border-radius: 20px;
    border: none;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    color: #464646;
    transition: all 0.2s;
    &:hover{
      background: #00C5D1;
    }
  }
`

const MessageReceiveMypageTitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 51px;
  padding-right: 21px;
  p {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    color: #FFFFFF;
  }
`

const MessageReceiveMypageTitleLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 104px;
`

const MessageScroll = styled.div`
  height: 670px;
  margin-top: 10px;
  overflow-y: scroll;
  
  &::-webkit-scrollbar{
      width: 7px;
      background-color: transparent;
      border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
      /* width: 10px; */
      height: 10%; 
      background-color: white;
      border-radius: 10px;
      height: 30px;
  }

  &::-webkit-scrollbar-track {
      background-color: #626873;
      border-left: 2px solid transparent;
      border-right: 2px solid transparent;
      background-clip: padding-box;
  }
`

const ReceiveMessageWrap = styled.div`
  width: 879px;
  height: ${(props) => {
    return props.isRead ? '150px' : '45px'
  }};
  display: flex;
  justify-content: space-between;
  align-items: ${(props) => {
    return props.isRead ? 'none' : 'center'
  }};
  padding-inline: 10px;
  padding-top: ${(props) => {
    return props.isRead ? '10px' : 'none'
  }};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 10px;
  background-color: ${(props) => {
    return props.isRead ? 'var(--bg-li)' : 'transparent'
  }};
  border-radius: 10px;
  &:hover{
    background: var(--bg-li);
  }
`

const ReceiveSendNickname = styled.p`
  width: 100px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  color: #FFFFFF;
`

const ReceiveContent = styled.p`
  width: 550px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  color: #FFFFFF;
  word-break: break-all;
  white-space: ${(props) => {
    return props.isRead ? 'normal' : 'nowrap'
  }};
  overflow: ${(props) => {
    return props.isRead ? 'visible' : 'hidden'
  }};
  text-overflow: ${(props) => {
    return props.isRead ? 'clip' : 'ellipsis'
  }};
`

const ReceiveCreatedAt = styled.p`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  color: #FFFFFF;
`

const MessagePopup = styled.div`
  position: relative;
  width: 384px;
  height: 502px;
  background: var(--bg-li);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--bg-li);
  border-radius: 10px;
  padding: 38px 32px 34px 32px;

  h1 {
    width: 295px;
    height: 72px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 26px;
    color: #FFFFFF;
  }

  h2 {
    width: 73px;
    height: 29px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    color: #FFFFFF; 
    margin-bottom: 3px;
  }

  input {
    width: 319px;
    height: 30px;
    background-color: #3E4957;
    border-radius: 108.396px;
    border:none;
    padding-left: 14px;
    outline: none;
    color: white;
    margin-bottom: 21px;
    color: #BEBEBE;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
  }

  textarea {
    width: 319px;
    height: 235px;
    border: 1px solid #FFFFFF;
    border-radius: 10px;
    outline: none;
    padding: 14px;
    background-color: transparent;
    color: #BEBEBE;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 23px;
    letter-spacing: 1.5px;
    overflow-y: scroll;
    resize: none;
    &::-webkit-scrollbar{
      width: 7px;
      background-color: transparent;
      border-radius: 8px;
    }
  }
`

const MessagePopupTextLength = styled.p`
  width: 94px;
  height: 22px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  color: ${(props) => {
    return props.textLength > 200 ? '#FF0000' : '#BEBEBE';
  }};
`

const MessagePopupBtnWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;

  button {
    width: 74px;
    height: 28px;
    background: #00F0FF;
    border-radius: 45.3455px;
    border: none;
    transition: all 0.2s;
    &:hover{
      background: #00C5D1;
    }
  }
`

const SearchScrollWrap = styled.div`
  width: 281px;
  height: 350px;
  overflow-y: scroll;
  margin-top: 20px;
  
  &::-webkit-scrollbar{
      width: 7px;
      background-color: transparent;
      border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
      /* width: 10px; */
      height: 10%; 
      background-color: white;
      border-radius: 10px;
      height: 30px;
  }

  &::-webkit-scrollbar-track {
      background-color: #626873;
      border-left: 2px solid transparent;
      border-right: 2px solid transparent;
      background-clip: padding-box;
  }
`

const FriendSearchContentWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`

const FriendSearchBtn = styled.button`
  width: 62.76px;
  height: 23.77px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  background: var(--po-de);
  border-radius: 13.3117px;
  color: #464646;
  border: none;
  transition: all 0.2s;
  &:hover {
    background: #00C5D1;
  }
`

const FriendReqWaitBtn = styled.p`
  width: 62.76px;
  height: 23.77px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  /* background: var(--po-de); */
  border-radius: 13.3117px;
  color: var(--po-de);
  border: 1px solid var(--po-de);
  display: flex;
  justify-content: center;
  align-items: center;
`
export default Mypage