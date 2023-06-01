import React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
                <button onClick={onClickSignUpHandler}>회원가입</button>
                <button onClick={onClickSignInHandler}>로그인</button>
                <button onClick={onClickLogOutHandler}>로그아웃</button>
                <button onClick={onClickMyPageHandler}>마이페이지</button>
                <button onClick={onClickAlearmHandler}>알람</button>
            </ButtonWrap>
        </CommonHeader>
    );
}

export const CommonHeader = styled.header`
    background: purple;
    color : white;
    width : 100vw;
    height : 50px;
`
export const ButtonWrap = styled.div`
    display: flex;
    justify-content: end;
    align-items : center;
`

export default Header;