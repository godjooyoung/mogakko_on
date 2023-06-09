import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getProfile, addProfile, getFriendList, getFriendRequestList, reciveFriendRequest, deleteFriend, githubIdPost } from '../axios/api/mypage'
import styled, { keyframes } from 'styled-components';
import Header from "../components/common/Header";
import useInput from '../hooks/useInput'

function Mypage() {

  const queryClient = useQueryClient()
  const [friendList, setFriendList] = useState([]) // 친구목록
  const [friendReqList, setFriendReqList] = useState([]) // 친구 요청 목록
  const { isLoading, isError, data } = useQuery("getProfile", getProfile)
  const [friendListDelete, setFriendListDelete] = useState(false) // 친구 삭제 버튼 
  const [onMouse, setOnMouse] = useState(false)
  const [friendDeleteArr, setFriendDeleteArr] = useState([])
  const [value, setValue] = useState(0)
  const [gitHub, setGitHub] = useState(false)
  const [userGitHubId, setuserGitHubId] = useState('')
  const [githubValue, onChangeGithubValue, githubInputValueReset] = useInput('')
  // github 아이디 입력 
  useEffect(() => {
    if (data) {
      console.log("마이페이지 조회 결과", data)
      console.log("마이페이지 조회 결과-profileImage", data.data.data.member.profileImage)
      console.log("마이페이지 조회 결과-nickname", data.data.data.member.nickname)
      setPreview(data.data.data.member.profileImage)

    }
    // 친구목록 조회 뮤테이트 콜
    friendListMutation.mutate()

    // 친구요청 목록 조회 뮤테이트 콜
    friendRequestListMutation.mutate()
  }, [data])

  useEffect(() => {
    setValue(data && data.data.data.member.codingTem);
    const interval = setInterval(() => {
      if (value < data) {
        setValue((prevValue) => prevValue + 1);
      }
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [data]);


  useEffect(() => {
    setuserGitHubId(data && data.data.data.member.githubId)
  }, [data]);

  const [fileAttach, setFileAttach] = useState('')
  const [preview, setPreview] = useState(data && data.data.data.member.profileImage)
  const [isFileModify, setIsFileModify] = useState(false)
  const filemutation = useMutation(addProfile, {
    onSuccess: (response) => {
      console.log("addProfile 성공", response)
    },
  })

  // 친구 목록 조회
  const friendListMutation = useMutation(getFriendList, {
    onSuccess: (response) => {
      console.log(">>> getFriendList 성공1", response)
      console.log(">>> getFriendList 성공2", response.data.data) // 친구목록
      console.log(">>> getFriendList 성공3", response.data.data[0])
      setFriendList(response.data.data)
    },
  })
  // 친구 요청 목록 조회
  const friendRequestListMutation = useMutation(getFriendRequestList, {
    onSuccess: (response) => {
      console.log(">>> getFriendRequestList 성공1", response)
      console.log(">>> getFriendRequestList 성공2", response.data.data)
      setFriendReqList(response.data.data)

    },
  })

  // 친구 수락/거절
  const reciveFriendMutation = useMutation(reciveFriendRequest, {
    onSuccess: (response) => {
      console.log(">>> reciveFriendRequest 성공", response)
      queryClient.invalidateQueries(getProfile)
    },
  })

  // 친구 삭제 버튼
  const friendListDeleteHandler = () => {
    setFriendListDelete(!friendListDelete)
  }


  // 친구 삭제
  const deleteFriendMutation = useMutation(deleteFriend, {
    onSuccess: (response) => {
      console.log(">>> deleteFriendMutation 성공", response)
      queryClient.invalidateQueries(getProfile)
    },
  })

  //githubId 등록
  const githubMutation = useMutation(githubIdPost, {
    onSuccess: (response) => {
      queryClient.invalidateQueries(getProfile)
    },
  })

  // 친구 요청 수락/취소 버튼 클릭 이벤트
  const onClickRequestFriendButtonHandler = (targetNickName, isAccept) => {
    console.log("친구 요청을 해준 닉네임", targetNickName)
    console.log("(친구요청?) 수락 거부", isAccept)
    //{"requestSenderNickname": String,"determineRequest": boolean}
    const target = { requestSenderNickname: targetNickName, determineRequest: isAccept }
    reciveFriendMutation.mutate(target)
  }

  // 친구 삭제 버튼 클릭 이벤트
  const onClickDeleteFriendButtonHandler = (targetNickName) => {
    console.log("삭제할 친구 닉네임", targetNickName)
    deleteFriendMutation.mutate(targetNickName)
  }

  // 00:00:00 to 00H00M
  const formatTime = (timeString) => {
    console.log("formatting 전 timeString > ", timeString)
    const time = new Date(`2000-01-01T${timeString}`);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}H${formattedMinutes}M`;
  }

  // 파일 수정
  const handleFileChange = (event) => {
    console.log("프로필 이미지 수정 핸들러 실행")
    setFileAttach(event.target.files[0])
    const objectUrl = URL.createObjectURL(event.target.files[0])
    setPreview(objectUrl)
    setIsFileModify(true)
  }

  // onchange 랑 onClick이랑 동시에 동작하면 왜 온클릭이 무시될까요? 일단 바꿈 
  // 프로필 이미지 저장
  const submitImgHandler = () => {
    console.log("프로필 이미지 전송 핸들러 실행")
    const newFile = new FormData();
    newFile.append("imageFile", fileAttach)
    filemutation.mutate(newFile)
    setIsFileModify(false)
  }

  //githubID 보내는 Mutation 
  const githubIdHandler = () => {
    githubMutation.mutate(githubValue)
  }
  useEffect(() => {
    if (isFileModify) {
      submitImgHandler()
    }
  }, [fileAttach])


  useEffect(() => {
    // 프로필 이미지가 기본 이미지일때는 랜덤 프로필 사진 보여줌. 등록했을 경우에는 등록된 이미지 파일 보여줌
    if (preview) {
      if (preview === 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtArY0iIz1b6rGdZ6xkSegyALtWQKBjupKJQ&usqp=CAU') {
        console.log("기본 프로필 입니다. 랜덤프로필 작업 필요")
        // const avataGen = `https://avatars.dicebear.com/api/identicon/${data.data.data.member.nickname}.svg`
        // const avataGen = `http://www.gravatar.com/avatar/${data.data.data.member.nickname}?d=identicon&s=400`
        const avataGen = `https://source.boringavatars.com/beam/120/${data.data.data.member.nickname}?colors=00F0FF,172435,394254,EAEBED,F9F9FA`
        setPreview(avataGen)
      } else {
        console.log("유저가 프로필을 등록한 사용자입니다. 현재 프로필 이미지는  => ", preview)
      }
    }
  }, [preview])

  // 물은표 버튼 hover시 나오는 정보창
  const statusOnMouseHandler = () => {
    setOnMouse(true)
  }

  const statusOffMouseHandler = () => {
    setOnMouse(false)
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
            }}>x</CloseBtn>
            <h1>깃허브 아이디</h1>
            <input type="text" placeholder='아이디' value={githubValue} onChange={onChangeGithubValue}/>
            <GitHubBtn onClick={() => {
              setGitHub(!gitHub)
              // setuserGitHubId(githubValue)
              githubIdHandler()
              githubInputValueReset()
            }}>확인</GitHubBtn>
          </PopUp>
        </Dark>
      }
      <MyPageTopContentWrap>
        <ProfileModifyWrap>
          <ProfileModifyContent encType="multipart/form-data" onSubmit={(e) => { e.preventDefault() }}>
            <ImageWrap BgImg={preview} />
            <div>
              {/* <FileButton htmlFor="file"><img src={`${process.env.PUBLIC_URL}/image/modifyBtn.webp`} alt="" /></FileButton> */}
              <FileButton htmlFor="file"
                modify={`${process.env.PUBLIC_URL}/image/modifyBtn.webp`}
                modifyClick={`${process.env.PUBLIC_URL}/image/modifyClickBtn.webp`}
              ></FileButton>
              <FileInput type="file" id="file" onChange={handleFileChange} />
            </div>
          </ProfileModifyContent>
          {/* <MyPageUserName>{data && data.data.data.member.nickname}</MyPageUserName> */}
          <MyPageUserNameWrap>
            <MyPageUserName>{data && data.data.data.member.nickname}</MyPageUserName>
            <Temperaturecontainer>
              <p>코딩온도</p>
              <TemperatureWrap>
                <ProgressContainer>
                  <Progress style={{ width: `${value}%` }} />
                </ProgressContainer>
                {/* <progress value={data && data.data.data.member.codingTem} min="0" max='100' /> */}
                <span>{data && data.data.data.member.codingTem}%</span>
              </TemperatureWrap>
            </Temperaturecontainer>
          </MyPageUserNameWrap>
          <TimerWrap>
            <div>
              <TopContentTitle>총 공부시간</TopContentTitle>
              <TopContentTitleItem>{data && data.data.data.totalTimer}</TopContentTitleItem>
            </div>

            <div>
              <TopContentTitle>이번 주 공부 시간</TopContentTitle>
              <TopContentTitleItem>{data && data.data.data.totalTimerWeek}</TopContentTitleItem>
            </div>

            <div>
              <TopContentTitleWrap>
                <TopContentTitle>Status</TopContentTitle>
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
                  onMouse &&
                  <MouseHoverBox>
                    <p>102 : <span>회원가입 시 기본값</span></p>
                    <p>200 : <span>처음 프로필 등록시 변경</span></p>
                    <p>400 : <span>신고 1회</span></p>
                    <p>401 : <span>신고 2회</span></p>
                    <p>404 : <span>신고 3회</span></p>
                    <p>109 : <span>모각코 시간 1시간 9분 경과</span></p>
                    <p>486 : <span>모각코 시간 4시간 8분 6초 경과</span></p>
                    <p>1004 : <span>모각코 시간 10시간 4분 경과</span></p>
                    <p>2514 : <span>모각코 시간 25시간 14분 경과</span></p>
                  </MouseHoverBox>
                }
              </TopContentTitleWrap>
              <TopContentTitleItem>{data && data.data.data.member.memberStatusCode}</TopContentTitleItem>
            </div>
          </TimerWrap>
        </ProfileModifyWrap>
      </MyPageTopContentWrap>

      <MyPageMiddleContentWrap>
        <p>깃허브 잔디</p>
        {
          userGitHubId ?
            <MyPageMiddleContent onClick={() => {
              setGitHub(!gitHub)
            }}>
              <GitHubImage src={`https://ghchart.rshah.org/394254/${userGitHubId}`} />
            </MyPageMiddleContent> :
            <NoGithubIdWrap onClick={() => {
              setGitHub(!gitHub)
            }}>
              <button></button>
              <p>깃허브 잔디를 등록해보세요</p>
            </NoGithubIdWrap>
        }
      </MyPageMiddleContentWrap>

      <MyPageBottomContentWrap>
        <FriendListContainer>
          <DeleteBtnWrap>
            <p>친구 목록</p>
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
                  <FriendListCancleBtn>삭제</FriendListCancleBtn>
                </FriendListCancleBtnWrap>
            }
          </DeleteBtnWrap>
          <ScrollWrap>
            <FriendListWrap>
              {/* for문 */}
              {friendList && friendList.map((friend, idx) => {
                return (
                  <>
                    <FriendList onClick={() => {

                    }}>
                      {
                        friendListDelete &&
                        <DeleteSelectedBtn></DeleteSelectedBtn>
                      }
                      <FriendListImage friendListImg={friend.member.profileImage}></FriendListImage>
                      <FriendListName>{friend.member.nickname}</FriendListName>
                      {/* <button onClick={() => { onClickDeleteFriendButtonHandler(friend.nickname) }}>삭제</button> */}
                    </FriendList>
                  </>
                )
              })}
            </FriendListWrap>
          </ScrollWrap>
        </FriendListContainer>

        <FriendRequestWrap>
          <FriendRequestTitle>친구 요청</FriendRequestTitle>
          {/* for문 */}
          <ScrollWrap>
            {
              friendReqList && friendReqList.map((friend, idx) => {
                return (
                  <>
                    <FriendWrap>
                      <FriendLeftContent>
                        <FriendProfile friendRequestImg={friend.profileImage}></FriendProfile>
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
        </FriendRequestWrap>
      </MyPageBottomContentWrap>
    </>
  )
}

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
  background: #394254;
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
  background: #00F0FF;
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
  width: 25px;
  height: 25px;
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 25px;
  border: none;
  background-color: transparent;
`

const MyPageTopContentWrap = styled.div`
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`

const ProfileModifyWrap = styled.div`
  display: flex;
  gap: 30px;
`

const ProfileModifyContent = styled.form`
  position: relative;
`

const MyPageUserNameWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  color: white;
`

const MyPageUserName = styled.p`
  width: 100%;
  font-size: 32px;
  color: white; 
`

const Temperaturecontainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    font-size: 17px;
    color: #00F0FF;
  }
`

const TemperatureWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  span {
    font-size: 14px;
    color: #00F0FF;
  }
`

const ProgressContainer = styled.div`
  width: 100px;
  height: 8px;
  margin-top: 2px;
  background:#f0f0f0;
  border-radius: 33px;
  border: none;
`;

const Progress = styled.div`
  height: 100%;
  border-radius:10px;
  background: #00F0FF;
  transition: width 1s ease;
  border: none;
`;


const ImageWrap = styled.div`
width: 155px;
height: 155px;
  border-radius: 50%;
  background-image: ${(props) =>
    `url(${props.BgImg})`
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
  right: 5px;
  bottom: 10px;
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

const TopContentTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
`

const TopContentTitle = styled.p`
  font-size: 18px;
  color: #00F0FF;
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

const MouseHoverBox = styled.div`
  position: absolute;
  right: -65px;
  bottom: -235px;
  width: 215px;
  height: 229px;
  background: #F9F9FA;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
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
  height: 280px;
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

const MyPageMiddleContent = styled.div`
  background-color: white;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
`

const NoGithubIdWrap = styled.div`
  width: 996px;
  height: 186px;
  background: #394254;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  button {
    background-color: transparent;
    padding: 20px;
    border: 4.08333px solid #BEBEBE;
    border-radius: 10px;
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
    `url(${props.friendRequestImg})`
  };
  background-position:center;
  background-size:contain;
  background-color : #D9D9D9;
`

const ButtonWrap = styled.div`
  display: flex;
  gap: 10px;
`

const AllowBtn = styled.button`
  width: 70px;
  background-color: ${(props) => {
    return props.color === 'allow' ? '#00F0FF' : '#626873'
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
    return props.color === 'cancle' ? '#626873' : '#00F0FF'
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
  height: 100%;
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
    background: #394254;
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
`

const FriendListImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: ${(props) =>
    `url(${props.friendListImg})`
  };
  background-position:center;
  background-size:contain;
  background-color : #D9D9D9;
`

const FriendListName = styled.p`
  color: white;
`
export default Mypage