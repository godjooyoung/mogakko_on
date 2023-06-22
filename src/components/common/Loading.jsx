import React from 'react'
import { styled } from 'styled-components';
function Loading(props) {
  return (
    <>
      <Dark>
        <LoadingImg src={`${process.env.PUBLIC_URL}/image/loading.gif`} alt="로딩 이미지" />
        <p>{props.content}</p>
      </Dark>
    </>
  )
}

export const Dark = styled.div`
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0,0.8);
    z-index: 5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(3px);
    gap: 21px;

    p{
      color: #FFF;
      text-align: center;
      font-size: 24px;
      font-family: Pretendard;
      font-weight: 500;
    }
`

export const LoadingImg = styled.img`
  width: 56px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

export default Loading