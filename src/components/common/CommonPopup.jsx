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
// secondMsg : 두줄 메세지 작성시

function CommonPopup(props) {

    return (
        <>
            <Dark>
                <PopUp>
                    <CloseBtn onClick={() => {
                        props.closeHander()
                    }}
                        closeBtn={`${process.env.PUBLIC_URL}/image/inputDeleteBtn.webp`}
                    ></CloseBtn>
                    <TextWrap isTitleOnly={props.secondMsg?false:true}>
                        <h1>{props.msg}</h1>
                        {props.secondMsg?<h1>{props.secondMsg}</h1>:<></>}
                        {props.thrMsg?<h1>{props.thrMsg}</h1>:<></>}
                    </TextWrap>
                    <BtnWrap isBtns={props.isBtns}>
                        {props.isBtns?<>
                            <Btn color='color' onClick={()=>{props.priHander()}}>{props.priMsg}</Btn>
                            <Btn onClick={()=>{props.secHandler()}}>{props.secMsg}</Btn>
                        </>:<>
                            <Btn isBtns={props.isBtns} color='color' onClick={()=>{props.priHander()}}>{props.priMsg}</Btn>
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
    background-color: rgba(0, 0, 0,0.8);
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(3px);
`

export const PopUp = styled.div`
    position: relative;
    width: 332px;
    height: 198px;
    background: var(--bg-li);
    /* border-radius: 8px; */
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    box-shadow: 5px 5px 20px 0 rgba(0,0,0,0.4);
    justify-content: space-between;

    h1 {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 15px;
        color: #FFFFFF;
    }
`
export const TextWrap = styled.div`
    text-align: center;
    width: 241px;
    height: 80px;
    margin-top: 47px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    h1 {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 15px;
        color: #FFFFFF;
        margin-bottom: 5px;
    }
`

export const BtnWrap = styled.div`
    width: 241px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    justify-content: ${(props) => {
        return props.isBtns? 'space-between' : 'center'
    }};
    gap: 12px;
    margin-bottom: 27px;
    margin-bottom: ${(props) => {
        return props.isBtns? '27px' : '34px'
    }};
`

export const Btn = styled.button`
    width: 109px;
    width: ${(props) => {
        return props.isBtns? '109px' : '164px'
    }};
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

export default CommonPopup;