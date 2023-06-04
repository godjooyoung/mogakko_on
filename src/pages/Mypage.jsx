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
          <form encType="multipart/form-data" onSubmit={(e) => { e.preventDefault() }}>
            <ImageWrap BgImg={preview} />
            <div>
              <FileButton htmlFor="file"><img src={`${process.env.PUBLIC_URL}/image/change.svg`} alt="" /></FileButton>
              <FileInput type="file" id="file" onChange={handleFileChange} onClick={() => { submitButtonHandler() }} />
            </div>
          </form>
          <MyPageUserName>신주영</MyPageUserName>
          <TimerWrap>
            <div>
              <p>총 순공시간</p>
              <h1>12H 42M</h1>
            </div>

            <div>
              <p>이번 주 순공 시간</p>
              <h1>3H 8M</h1>
            </div>

            <div>
              <p>Status</p>
              <h1>200</h1>
            </div>
          </TimerWrap>
        </ProfileModifyWrap>
      </MyPageTopContentWrap>
    </>
  )
}

const MyPageTopContentWrap = styled.div`
  height: 264px;
  background-color: #394254;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

const ProfileModifyWrap = styled.div`
  display: flex;
`

const MyPageUserName = styled.p`
  font-size: 32px;
  color: white;
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
  left: 140px;
  top: 181px;
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

export default Mypage