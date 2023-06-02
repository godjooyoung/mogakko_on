import React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { removeCookie } from '../../cookie/Cookie';

function Header() {
    const navigate = useNavigate();

    const onClickLogoHandler = () => {
        navigate('/')
    }
    const onClickSignUpHandler = () => {
        navigate('/signup')
    }
    const onClickSignInHandler = () => {
        navigate('/signin')
    }
    const onClickLogOutHandler = () => {
        // 로그아웃 처리 쿠키 삭제
        removeCookie('token')
        navigate('/')
    }
    const onClickMyPageHandler = () => {
        navigate('/mypage')
    }
    const onClickAlearmHandler = () => {
        // 알람튀어나오게
    }

    return (
        <CommonHeader>
            <ButtonWrap>
                <button onClick={onClickLogoHandler}>로고</button>
                <HeaderRightContent>
                    <button onClick={onClickSignUpHandler}>회원가입</button>
                    <button onClick={onClickSignInHandler}>로그인</button>
                    <button onClick={onClickLogOutHandler}>로그아웃</button>
                    <button onClick={onClickMyPageHandler}>마이페이지</button>
                    <AlearmWrap>
                        <button onClick={onClickAlearmHandler}>알람</button>
                        <AlearHeader></AlearHeader>
                        <AlearWrapContent>
                            <AlearTitle>알림</AlearTitle>
                        </AlearWrapContent>
                    </AlearmWrap>
                </HeaderRightContent>
            </ButtonWrap>
        </CommonHeader>
    );
}

export const CommonHeader = styled.header`
    background: purple;
    color : white;
    width : 100%;
    height : 50px;
`
export const ButtonWrap = styled.div`
    display: flex;
    justify-content: space-between;
    height: 100%;
    align-items : center;
`
export const HeaderRightContent = styled.div`
    
`

export const AlearmWrap = styled.div`
    position: relative;
    display: inline-block;
`

export const AlearHeader = styled.div`
    width: 40px;
    height: 40px;
    position: absolute;
    top: 40px;
    left: -40px;
    background-color: #EDF5FF;
    transform: rotate(-45deg); 
    border-top-right-radius: 6px;
`

export const AlearWrapContent = styled.div`
    width: 200px;
    height: 250px;
    position: absolute;
    top: 50px;
    right: 5px;
    background-color: #EDF5FF;
    border-radius: 6px;
`

export const AlearTitle = styled.p`
    font-size: 14px;
    color: black;
    padding-top: 5px;
    padding-left: 5px;
    box-sizing: border-box;
`
export default Header;