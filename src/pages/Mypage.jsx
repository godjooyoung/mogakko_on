import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getProfile, addProfile, getFriendList, getFriendRequestList, reciveFriendRequest, deleteFriend } from '../axios/api/mypage'
import styled from 'styled-components'
import Header from "../components/common/Header";

function Mypage() {

  
  const [friendList, setFriendList] = useState([]) // 친구목록
  const [friendReqList, setFriendReqList] = useState([]) // 친구 요청 목록
  const { isLoading, isError, data } = useQuery("getProfile", getProfile)
  
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

  const [fileAttach, setFileAttach] = useState('')
  const [preview, setPreview] = useState(data && data.data.data.member.profileImage)

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
    },
  })

  // 친구 삭제
  const deleteFriendMutation = useMutation(deleteFriend, {
    onSuccess: (response) => {
      console.log(">>> deleteFriendMutation 성공", response)
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
  }

  // 프로필 이미지 수정
  const submitButtonHandler = () => {
    console.log("프로필 이미지 전송 핸들러 실행")
    const newFile = new FormData();
    newFile.append("imageFile", fileAttach)
    filemutation.mutate(newFile)
  }


  return (
    <>
      <Header />
      <MyPageTopContentWrap>
        <ProfileModifyWrap>
          <ProfileModifyContent encType="multipart/form-data" onSubmit={(e) => { e.preventDefault() }}>
            <ImageWrap BgImg={preview} />
            <div>
              <FileButton htmlFor="file"><img src={`${process.env.PUBLIC_URL}/image/change.svg`} alt="" /></FileButton>
              <FileInput type="file" id="file" onChange={handleFileChange} onClick={() => { submitButtonHandler() }} />
            </div>
          </ProfileModifyContent>
          <MyPageUserName>{data && data.data.data.member.nickname}</MyPageUserName>
          <TimerWrap>
            <div>
              <TopContentTitle>총 순공시간</TopContentTitle>
              <TopContentTitleItem>{formatTime(data && data.data.data.mogakkoTotalTime)}</TopContentTitleItem>
            </div>

            <div>
              <TopContentTitle>이번 주 순공 시간</TopContentTitle>
              <TopContentTitleItem>3H 8M</TopContentTitleItem>
            </div>

            <div>
              <TopContentTitle>Status</TopContentTitle>
              <TopContentTitleItem>502</TopContentTitleItem>
            </div>
          </TimerWrap>
        </ProfileModifyWrap>
      </MyPageTopContentWrap>

      <MyPageMiddleContentWrap>
        <MyPageMiddleContent>
          <GitHubImage src="https://ghchart.rshah.org/394254/Shinheeje" />
        </MyPageMiddleContent>
      </MyPageMiddleContentWrap>

      <MyPageBottomContentWrap>
        <FriendRequestWrap>
          <h1>친구 요청</h1>
          {/* for문 */}
          {
            friendReqList&&friendReqList.map((friend, idx) => {
              return (
                <>
                  <FriendWrap>
                    <FriendLeftContent>
                      <FriendProfile></FriendProfile>
                      <p>{friend.nickname}</p>
                    </FriendLeftContent>
                    <ButtonWrap>
                      <button onClick={()=>{onClickRequestFriendButtonHandler(friend.nickname, true)}}>수락</button>
                      <button onClick={()=>{onClickRequestFriendButtonHandler(friend.nickname, false)}}>거절</button>
                    </ButtonWrap>
                  </FriendWrap>
                </>
              )
            })
          }

        </FriendRequestWrap>

        <FriendListWrap>
          <p>친구 목록</p>
          {/* for문 */}
          {friendList&&friendList.map((friend, idx) => {
            return (
              <>
                <FriendList>
                  <FriendListImage></FriendListImage>
                  <FriendListName>{friend.nickname}</FriendListName>
                  <button onClick={() => { onClickDeleteFriendButtonHandler(friend.nickname) }}>삭제</button>
                </FriendList>
              </>
            )
          })}
        </FriendListWrap>
      </MyPageBottomContentWrap>
    </>
  )
}

const MyPageTopContentWrap = styled.div`
  height: 264px;
  background-color: #394254;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`

const ProfileModifyWrap = styled.div`
  display: flex;
`

const ProfileModifyContent = styled.form`
  position: relative;
`

const MyPageUserName = styled.p`
  font-size: 32px;
  color: white;
  margin-right: 100px;
`

const ImageWrap = styled.div`
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background-image: ${(props) =>
    `url(${props.BgImg})`
  };
  background-position:center;
  background-size:contain;
  background-color : white;
`

const FileButton = styled.label`
  display: inline-block;
  color: black;
  background-color: #f7ddde;
  cursor: pointer;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: absolute;
  right: 10px;
  bottom: 10px;
  &:hover {
    background-color:rgb(234, 30, 71);
    transition: all 0.3s;
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
  align-items: end;
  margin-bottom: 20px;
`
const TopContentTitle = styled.p`
  font-size: 18px;
`

const TopContentTitleItem = styled.h1`
  font-size: 32px;
`

const MyPageMiddleContentWrap = styled.div`
  height: 204px;
  background-color: #394254;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

const MyPageMiddleContent = styled.div`
  background-color: white;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 8px;
`

const GitHubImage = styled.img`
  width: 1200px;
`

const MyPageBottomContentWrap = styled.div`
  height: 300px;
  background-color: #394254;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  gap: 20px;
`

const FriendRequestWrap = styled.div`
  width: 500px;
  height: 250px;
  background-color:#EAEBED;;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 8px;
`

const FriendWrap = styled.div`
  background-color: white;
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
    `url(${props.BgImg})`
  };
  background-position:center;
  background-size:contain;
  background-color : #D9D9D9;
`

const ButtonWrap = styled.div`
  display: flex;
  gap: 10px;
  button {
    width: 70px;
    background-color: #bbbbf2;
    border: none;
    padding: 8px;
  }
`

const FriendListWrap = styled.div`
  width: 710px;
  height: 250px;
  background-color:#EAEBED;;
  border-radius: 8px;
  padding: 10px;
`

const FriendList = styled.div`
  width: 82px;
  height: 100px;
  background-color: #172435;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap:10px;
  margin-top: 10px;
`

const FriendListImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: ${(props) =>
    `url(${props.BgImg})`
  };
  background-position:center;
  background-size:contain;
  background-color : #D9D9D9;
`

const FriendListName = styled.p`
  color: white;
`
export default Mypage