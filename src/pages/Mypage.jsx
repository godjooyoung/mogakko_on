
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getProfile, addProfile, getFriendList, getFriendRequestList, reciveFriendRequest, deleteFriend, githubIdPost } from '../axios/api/mypage'
import styled from 'styled-components';
import Header from "../components/common/Header";
import useInput from '../hooks/useInput'
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../cookie/Cookie';
import ChartLan from '../components/ChartLan';

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

function Mypage() {

  const getFriendListIsSuccessHandler = () => {
    console.log('친구목록 조회 성공', friendListData)
  }
  const getFriendListIsErrorHandler = () => {
    console.log('친구목록 조회 실패', friendListData)
    setFriendList([])
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

  // hooks
  const navigate = useNavigate()

  useEffect(() => {
    if (profileData) {
      console.log("마이페이지 조회 결과", profileData)
      console.log("마이페이지 조회 결과-profileImage", profileData.data.data.member.profileImage)
      console.log("마이페이지 조회 결과-nickname", profileData.data.data.member.nickname)

      setCookie('userProfile', profileData.data.data.member.profileImage)
      setPreview(profileData.data.data.member.profileImage)
      setuserGitHubId(profileData.data.data.member.githubId)
    }
  }, [profileData])

  // 친구목록 조회 useEffect
  useEffect(() => {
    if (friendListData) {
      console.log("친구목록 조회 1", friendListData)
      console.log("친구목록 조회 2", friendListData.data.data)
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
      console.log("친구요청목록 조회 1", friendRequestListData)
      console.log("친구요청목록 조회 2", friendRequestListData.data.data)
    }
  }, [friendRequestListData])

  // 코딩온도 애니메이션 useEffect
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
    if (isFileModify) {
      submitImgHandler()
    }
  }, [fileAttach])

  // 프로필 썸네일 useEffect
  useEffect(() => {
    // 프로필 이미지가 기본 이미지일때는 랜덤 프로필 사진 보여줌. 등록했을 경우에는 등록된 이미지 파일 보여줌
    if (preview) {
      if (preview === 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtArY0iIz1b6rGdZ6xkSegyALtWQKBjupKJQ&usqp=CAU') {
        console.log("기본 프로필 입니다. 랜덤프로필 작업 필요")
        const avataGen = `https://source.boringavatars.com/beam/120/${profileData.data.data.member.nickname}?colors=00F0FF,172435,394254,EAEBED,F9F9FA`
        setPreview(avataGen)
      } else {
        console.log("유저가 프로필을 등록한 사용자입니다.", preview)
      }
    }
  }, [preview])

  // 친구 삭제 뮤테이션
  const deleteFriendMutation = useMutation(deleteFriend, {
    onSuccess: (response) => {
      console.log("친구 삭제 성공", response)
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
      console.log("프로필 사진 수정 성공", response)
      queryClient.invalidateQueries(getProfile)
      queryClient.invalidateQueries(getFriendList)
      queryClient.invalidateQueries(getFriendRequestList)
    },
  })

  // 친구 수락/거절
  const reciveFriendMutation = useMutation(reciveFriendRequest, {
    onSuccess: (response) => {
      console.log("친구 신청 수락/거절", response)
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
    console.log("친구 요청을 해준 닉네임", targetNickName)
    console.log("(친구요청?) 수락 거부", isAccept)
    const target = { requestSenderNickname: targetNickName, determineRequest: isAccept }
    reciveFriendMutation.mutate(target)
  }

  // 친구 삭제 여러건 선택 핸들러
  const onClickDeleteFriendCheckHandler = (targetNickName, idx, isSelected) => {
    console.log("삭제하기 위해 선택한 친구 닉네임", targetNickName)
    console.log("삭제하기 위해 선택한 친구 인덱스", idx)
    console.log("삭제하기 위해 선택한 친구 선택여부", isSelected)
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
    console.log("삭제할 친구 목록", deleteFriendList)
    deleteFriendMutation.mutate(deleteFriendList)
  }

  // 파일 수정 핸들러
  const handleFileChange = (event) => {
    console.log("프로필 이미지 수정 핸들러 실행")
    setFileAttach(event.target.files[0])
    const objectUrl = URL.createObjectURL(event.target.files[0])
    setPreview(objectUrl)
    setIsFileModify(true)
  }

  // 프로필 이미지 저장 핸들러 - onchange 랑 onClick이랑 동시에 동작하면 왜 온클릭이 무시될까요? 일단 바꿈 
  const submitImgHandler = () => {
    console.log("프로필 이미지 전송 핸들러 실행")
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

  return (
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
            <h1>깃허브 아이디</h1>
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
              <ImageWrap BgImg={preview} width='155px' height='155px' />
              <div>
                <FileButton htmlFor="file"
                  modify={`${process.env.PUBLIC_URL}/image/modifyBtn.webp`}
                  modifyClick={`${process.env.PUBLIC_URL}/image/modifyClickBtn.webp`}
                ></FileButton>
                <FileInput type="file" id="file" onChange={handleFileChange} />
              </div>
            </ProfileModifyContent>
            <MyPageUserName>{profileData && profileData.data.data.member.nickname}</MyPageUserName>

            <MyCodeWrap>
              <MyCode>나의 코드: {profileData && profileData.data.data.member.friendCode}</MyCode>
              <CopyBtn>COPY</CopyBtn>
            </MyCodeWrap>

            <NavberCategory>
              <DataCategory>모각코 데이터</DataCategory>
              <FriendCategory>친구</FriendCategory>
              <Message>쪽지</Message>
            </NavberCategory>

          </MypageNavbar>
          <WidthBox>
            <MyPageTopContentWrap>
              <MogakkoTitle>모각코 데이터</MogakkoTitle>
              <ProfileModifyWrap>
                <Temperaturecontainer>
                  <TemperatureTitle>On°
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

                <TotalTimewrap>
                  <TopContentTitle>총 공부시간</TopContentTitle>
                  <TopContentTitleItem>{profileData && profileData.data.data.totalTimer}</TopContentTitleItem>
                </TotalTimewrap>

                <WeeklyTimeWrap>
                  <TopContentTitle>이번 주 공부 시간</TopContentTitle>
                  <TopContentTitleItem>{profileData && profileData.data.data.timeOfWeek.weekTotal}</TopContentTitleItem>
                </WeeklyTimeWrap>

                <StatusWrap>
                  <TopContentTitleWrap>
                    <TopContentTitle>STATUS</TopContentTitle>
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
                        <p>400 : <span>신고 1회</span></p>
                        <p>401 : <span>신고 2회</span></p>
                        <p>404 : <span>신고 3회</span></p>
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
                <AttendanceCheckWrap>
                  출석체크
                </AttendanceCheckWrap>
                <StudyTime>
                  공부시간 (이번주)
                </StudyTime>
              </WeeklyStudyTimewrap>
              <TotalLanguageWrap>
                <p>통합 선택 언어</p>
                <TotalLanguage>
                  <ChartLan />
                </TotalLanguage>
              </TotalLanguageWrap>
            </ChartWrap>

            <MyPageMiddleContentWrap>
              {/* <div><p>깃허브 잔디</p><img src={`${process.env.PUBLIC_URL}/image/enterArrow.webp`} alt="화살표 아이콘" /></div> */}
              <GithubTitleWrap>
                <p>깃허브 잔디</p>
                {userGitHubId === null || userGitHubId === undefined || userGitHubId === ' ' ?
                  null :
                  <GithubModifyImg
                    modify={`${process.env.PUBLIC_URL}/image/githubModify.webp`}
                    modifyHo={`${process.env.PUBLIC_URL}/image/githubModifyHo.webp`}
                    modifyClcik={`${process.env.PUBLIC_URL}/image/githubModifyClick.webp`}
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

            {/* <MyPageBottomContentWrap>
              <FriendListContainer>
                <DeleteBtnWrap>
                  <p>친구 목록</p>
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
                      <h1>추가한 친구가 없습니다</h1>
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
                              </FriendList>
                            </>
                          )
                        })}
                      </FriendListWrap>
                    </ScrollWrap>
                }
              </FriendListContainer>

              <FriendRequestWrap>
                <FriendRequestTitle>친구 요청</FriendRequestTitle>
                {
                  friendRequestListData && !friendRequestListData.data.data ?
                    <NullFriendRequestList>
                      <h1>아직 친구 요청이 없습니다.</h1>
                    </NullFriendRequestList> :
                    <ScrollWrap>
                      {friendRequestListData && friendRequestListData.data.data.map((friend, idx) => {
                        return (
                          <>
                            <FriendWrap>
                              <FriendLeftContent>
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
                    </ScrollWrap>
                }
              </FriendRequestWrap>
            </MyPageBottomContentWrap > */}
          </WidthBox>
        </MypageWrap>
      </FlexBox>
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
    margin-bottom: 20px;
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
    font-family: 'Pretendard-Regular';
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
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  right: 15px;
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
  font-size: 30px;
  color: white; 
  margin-top: 26px;
`

const Temperaturecontainer = styled.div`
  width: 207px;
  height: 108px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

const TemperatureTitle = styled.p`
    font-size: 17px;
    color: var(--po-de);
    font-weight: 900;
    img {
      margin-left: 5px;
      margin-bottom: 2px;
    }
`

const TemperatureMouseHoverBox = styled.div`
  position: absolute;
  top: 60px;
  
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
  align-items: center;
`

const WeeklyTimeWrap = styled.div`
  width: 207px;
  height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StatusWrap = styled.div`
  width: 207px;
  height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const TopContentTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
`

const TopContentTitle = styled.p`
  font-size: 18px;
  color: var(--po-de);
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
  font-size: 32px;
  color: white;
`

const StatusMouseHoverBox = styled.div`
  position: absolute;
  right: -65px;
  bottom: -235px;
  width: 215px;
  height: 229px;
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
    width: 863px;
  }
`

const GithubModifyImg = styled.div`
  width: 33px;
  height: 33px;
  transition: all 0.3s;
  cursor: pointer;
  background-image: url(
        ${(props) => {
    return props.modify
  }}
  );
  &:hover {
      background-image: url(
          ${(props) => {
    return props.modifyHo
  }}
    );
  }

  &:active {
    background-image: url(
          ${(props) => {
    return props.modifyClcik
  }}
    );
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
  gap: 20px;
`

const FriendRequestWrap = styled.div`
  width: 400px;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 8px;
`

const NullFriendRequestList = styled.div`
  width: 384px;
  height: 261px;
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
    font-size: 14px;
    width: 98px;
    color: white;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const FriendWrap = styled.div`
  width: 352px;
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
  width: 50px;
  height: 50px;
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
  width: 70px;
  background-color: ${(props) => {
    return props.color === 'allow' ? 'var(--po-de)' : '#626873'
  }};
  border: none;
  padding: 8px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 12px;
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
  width: 555px;
  height: 100%;
  border-radius: 8px;
  padding: 10px;
  margin-right: 70px;
  p{
    color: white;
    font-weight: 500;
    font-size: 14px;
    width: 98px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const DeleteBtnWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px;
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
`

const ScrollWrap = styled.div`
  width: 100%;
  height: 261px;
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
  width: 486px;
  height: 261px;
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

const FriendList = styled.div`
  width: 114.1px;
  height: 139px;
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
  width: 50px;
  height: 50px;
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
  background: #232B3D;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  margin-right: 66px;
  padding: 39px 43px 0 43px;
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
`

const NavberCategory = styled.ul`
  width: 240px;
  height: 82px;

  li {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 22px;
    color: #FFFFFF;
    transition: all 0.3s;
    &:hover {
      background-color: #3E4957;
    }
  }
`

const DataCategory = styled.li`
  width: 240px;
  height: 82px;
`

const FriendCategory = styled.li`
  width: 240px;
  height: 82px;
`

const Message = styled.li`
    width: 240px;
    height: 82px;
`

const ChartWrap = styled.div`
  width: 100%;
  height: 376px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin-bottom: 18px;
`

const StudyTime = styled.div`
  width: 486px;
  height: 183px;
  background-color: var(--bg-li);
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
`
export default Mypage