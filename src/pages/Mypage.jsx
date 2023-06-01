import React, { useState } from 'react'
import { useMutation } from "react-query";
import { addprofile } from '../axios/api/mypage';
import styled from "styled-components";
function Mypage() {

  const [fileAttach, setFileAttach] = useState("");
  const [preview, setPreview] = useState("");

  const filemutation = useMutation(addprofile, {
    onSuccess: (response) => {
      
    },
  });

  const handleFileChange = (event) => {
    setFileAttach(event.target.files[0]);
    const objectUrl = URL.createObjectURL(event.target.files[0]);
    setPreview(objectUrl);
  };

  const submitButtonHandler = () => {
    const newFile = new FormData();
    newFile.append("imageFile", fileAttach);
    filemutation.mutate(newFile);
  };

  return (
    <>
      <form
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <img src={preview} alt="프로필 사진" />
        </div>
        <div>
          <FileButton htmlFor="file">프로필사진 등록</FileButton>
          <FileInput type="file" id="file" onChange={handleFileChange} onClick={() => {
            submitButtonHandler()
          }}/>
        </div>
      </form>
    </>
  )
}

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