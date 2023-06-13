import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function TermsModal(props) {
    return (

<>
<Dark>
  <PopUp>
    <CloseBtn onClick={() => {
      props.onClose()
    }}
      closeBtn={`${process.env.PUBLIC_URL}/image/PopUpCloseBtn.webp`}
    ></CloseBtn>
    
  </PopUp>
</Dark>
</>
)
}

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
width: 332px;
height: 266px;
background: #394254;
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