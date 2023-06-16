import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function TermsModal({ onClose, onAgree }) {
  return (

    <>
      <Dark>
        <PopUp>
          <CloseBtn onClick={onClose}
            closeBtn={`${process.env.PUBLIC_URL}/image/PopUpCloseBtn.webp`}
          ></CloseBtn>


          <PopupTitle>위치 기반 서비스 이용 약관</PopupTitle>
          <PopupContent>
            <p>
              본 서비스는 사용자에게 최적화된 서비스 제공을 위해 위치 정보를 수집 및 활용합니다.
            </p>
            <h3>제1조 (위치정보의 수집 및 이용)</h3>
            <p>
              1. 회사는 사용자의 위치 정보를 수집하고 이를 이용하여 서비스를 제공합니다.
              <br />
              2. 회사는 사용자의 위치 정보를 수집하기 위해 GPS, Wi-Fi 또는 통신사 기지국 등의 수단을 사용할 수 있습니다.
              <br />
              3. 회사는 사용자의 위치 정보를 이용하여 위치 기반 서비스를 제공합니다.
            </p>
            <h3>제2조 (위치정보의 보유 및 이용 기간)</h3>
            <p>
              1. 회사는 위치정보의 수집 및 이용과 관련된 동의를 받은 후 즉시 위치 정보를 파기합니다.
              <br />
              2. 동의를 받은 이후에도 사용자는 언제든지 위치 정보 수집·이용 동의를 철회할 수 있습니다.
            </p>
            <h3>제3조 (동의의 철회)</h3>
            <p>
              1. 사용자는 위치 정보의 수집·이용에 대한 동의를 언제든지 철회할 수 있습니다.
              <br />
              2. 동의를 철회한 경우, 회사가 제공하는 위치 기반 서비스의 일부 또는 전부를 이용할 수 없게 됩니다.
            </p>
            <p>
              위의 내용을 충분히 이해하였으며, 회사가 위치 정보를 수집·이용하는 것에 동의합니다.
            </p>          </PopupContent>

          <BtnWrap>
            <Btn type='button' color='color' onClick={onAgree}>동의하기</Btn>
          </BtnWrap>


        </PopUp>
      </Dark>
    </>
  );
};

export default TermsModal;


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
width: 708px;
height: 845px;
max-height: 90vh;
background: var(--bg-li);
border-radius: 20px;
display: flex;
flex-direction: column;
justify-content: space-between;
font-family: 'Pretendard';
font-style: normal;
font-weight: 600;
// font-size: 24px;
line-height: 29px;


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

export const PopupTitle = styled.div`
  margin:63px 60px 40px 56px;
  font-family: 'Pretendard';
font-style: normal;
font-weight: 600;
font-size: 24px;
line-height: 29px;
display: flex;
align-items: center;
color: #FFFFFF;
`
export const PopupContent = styled.div`
flex:1;
width: 574px;
height: 606px;
overflow-y: auto;
margin:0 74px 102px 60px;
font-family: 'Pretendard';
font-style: normal;
font-weight: 400;
// font-size: 13px;
line-height: 172.02%;
color: #FFFFFF;
h3 {
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 60px;
}

p {
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 40px;
}
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
  background-color: white;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  background-clip: padding-box;
}

`
export const SignInBtnWrap = styled.div`
display: flex;
justify-content: space-between;
gap: 20px;
`
export const CloseBtn = styled.button`
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
export const BtnWrap = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    align-items: flex-end; 
    margin-bottom:27px;
    margin-top:auo;
`
export const Btn = styled.button`
    width: 164px;
    height: 32px;
    background: ${(props) => {
    return props.color === 'color' ? 'var(--po-de)' : '#E2E2E2'
  }};
    border-radius: 359px;
    border: none;
    transition: all 0.3s;
    font-weight: 700;
    font-size: 15px;
    color: #464646;
    transition: all 0.3s;
    &:hover {
            background: ${(props) => {
    return props.color === 'color' ? '#00C5D1' : '#C7C7C7'
  }};
    }
    
`