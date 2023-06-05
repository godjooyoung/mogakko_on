import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getProfile, addProfile } from '../axios/api/mypage'
import styled from 'styled-components'
import Header from "../components/common/Header";

function Mypage() {

  const { isLoading, isError, data } = useQuery("getProfile", getProfile)

  useEffect(() => {
    console.log("조회결과 ", data)
  }, [data])

  const [fileAttach, setFileAttach] = useState('')
  const [preview, setPreview] = useState('')

  const filemutation = useMutation(addProfile, {
    onSuccess: (response) => {
      console.log("addProfile 성공", response)
    },
  })

  const handleFileChange = (event) => {
    setFileAttach(event.target.files[0])
    const objectUrl = URL.createObjectURL(event.target.files[0])
    setPreview(objectUrl)
  }

  const submitButtonHandler = () => {
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
          <MyPageUserName>신주영</MyPageUserName>
          <TimerWrap>
            <div>
              <TopContentTitle>총 순공시간</TopContentTitle>
              <TopContentTitleItem>12H 42M</TopContentTitleItem>
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

          <FriendWrap>
            <FriendLeftContent>
              <FriendProfile></FriendProfile>
              <p>신주영</p>
            </FriendLeftContent>
            <ButtonWrap>
              <button>수락</button>
              <button>거절</button>
            </ButtonWrap>
          </FriendWrap>
        </FriendRequestWrap>

        <FriendListWrap>
          <p>친구 목록</p>

          <FriendList>
            <FriendListImage></FriendListImage>
            <FriendListName>신주영</FriendListName>
          </FriendList>
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