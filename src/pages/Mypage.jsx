import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getProfile, addProfile } from '../axios/api/mypage'
import styled from 'styled-components'

function Mypage() {
  
  const { isLoading, isError, data } = useQuery("getProfile", getProfile)
  
  useEffect(()=>{
    console.log("조회결과 ", data)
  },[data])

  const [fileAttach, setFileAttach] = useState('')
  const [preview, setPreview] = useState('')

  const filemutation = useMutation(addProfile, {
    onSuccess: (response) => {
      console.log("addProfile 성공",  response)
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
      <form encType="multipart/form-data" onSubmit={(e) => { e.preventDefault() }}>
        <ImageWrap BgImg={preview} />
        <div>
          <FileButton htmlFor="file">프로필사진 등록</FileButton>
          <FileInput type="file" id="file" onChange={handleFileChange} onClick={() => { submitButtonHandler()}}/>
        </div>
      </form>
    </>
  )
}

const ImageWrap = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-image: ${( props ) =>
    `url(${props.BgImg})`
  };
  background-position:center;
  background-size:contain;
  background-color : white;
`

const FileButton = styled.label`
  display: inline-block;
  padding: 10px 20px;
  color: black;
  background-color: #f7ddde;
  cursor: pointer;
  height: 40px;
  margin-left: 10px;
  box-sizing: border-box;
  &:hover {
    background-color:rgba(234, 30, 71, 0.8);
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

export default Mypage