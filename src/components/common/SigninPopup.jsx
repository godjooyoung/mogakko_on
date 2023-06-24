import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

function SigninPopup(props) {
  const navigate = useNavigate()
  
  return (
    <>
      <Dark>
        <PopUp>
          <CloseBtn onClick={() => {
            props.closeHander()
          }}
            closeBtn={`${process.env.PUBLIC_URL}/image/PopUpCloseBtn.webp`}
          ></CloseBtn>
          <img src={`${process.env.PUBLIC_URL}/image/loginPopUp.webp`} alt="로그인 팝업 아이콘" />
          <h1>로그인이 필요한 서비스입니다</h1>
          <SignInBtnWrap>
            <SignBtn onClick={() => {
              props.closeHander()
              navigate('/signin')
            }}
              color='color'
            >로그인</SignBtn>
            <SignBtn onClick={() => {
              props.closeHander()
              navigate('/signup')
            }}
            >회원가입</SignBtn>
          </SignInBtnWrap>
        </PopUp>
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
    background-color: rgba(0, 0, 0,0.6);
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(3px);
`

export const PopUp = styled.div`
    position: relative;
    width: 332px;
    height: 266px;
    background: var(--bg-li);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 15px;
        color: #FFFFFF;
        margin-top: 15px;
        margin-bottom: 30px;
    }
`

export const SignInBtnWrap = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
`

export const SignBtn = styled.button`
    width: 109px;
    height: 38px;
    background: ${(props) => {
    return props.color === 'color' ? 'var(--po-de)' : '#E2E2E2'
  }};
    border-radius: 359px;
    border: none;
    transition: all 0.3s;
    font-weight: 700;
    font-size: 15px;
    font-family: Pretendard;
    color: #464646;
    transition: all 0.3s;
    &:hover {
            background: ${(props) => {
    return props.color === 'color' ? '#00C5D1' : '#C7C7C7'
  }};
    }
`

export const CloseBtn = styled.button`
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

export default SigninPopup