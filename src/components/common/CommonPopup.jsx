import React from 'react';
import styled from 'styled-components'

// 공통 커스텀 팝업

// msg : 화면에 표시되는 메세지
// isBtns : boolean
// priMsg  'primery 버튼 내용'
// secMsg  'second 버튼 내용'
// priHander : 'primery 버튼 클릭시 동작하는 함수'
// secHandler : 'secondFun 버튼 클릭시 동작하는 함수'
// closeHander : 닫기 함수

function CommonPopup(props) {

    return (
        <>
            <Dark>
                <PopUp>
                    <CloseBtn onClick={() => {
                        props.closeHander()
                    }}
                        closeBtn={`${process.env.PUBLIC_URL}/image/PopUpCloseBtn.webp`}
                    ></CloseBtn>
                    <h1>{props.msg}</h1>
                    <BtnWrap>
                        {props.isBtns?<>
                            <Btn color='color' onClick={()=>{props.priHander()}}>{props.priMsg}</Btn>
                            <Btn onClick={()=>{props.secHandler()}}>{props.secMsg}</Btn>
                        </>:<>
                            <Btn color='color' onClick={()=>{props.priHander()}}>{props.priMsg}</Btn>
                        </>}
                    </BtnWrap>
                </PopUp>
            </Dark>
        </>
    );
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
    height: 198px;
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

export const BtnWrap = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
`

export const Btn = styled.button`
    width: 109px;
    height: 38px;
    background: ${(props) => {
        return props.color === 'color' ? '#00F0FF' : '#E2E2E2'
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

export default CommonPopup;