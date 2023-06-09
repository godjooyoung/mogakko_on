import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
// import signupdone from '../public/image/회원가입 완료.webp';

function Done() {
    const navigate = useNavigate();
    const SigninButtonHandler = () => {
        navigate('/signin')
    }
    return (
        <FormDiv>
            <FormBox>
                <ImageWrapper>
                    <img src={`${process.env.PUBLIC_URL}/image/signupDone.webp`} alt="체크" width='102' height='102' />

                    {/* <div style={{backgroundImage :'url('+signupdone+')'}}></div> */}
                </ImageWrapper>
                <Title>회원가입 완료</Title>
                <Subtitle>회원가입이 완료되었습니다.<br />
                    모각코하며 함께 성장할 친구를 만나보세요!</Subtitle>
                <SigninButton onClick={SigninButtonHandler}>로그인하기</SigninButton>

            </FormBox>
        </FormDiv>
    )
};




export default Done;

export const FormDiv = styled.div`
    display:flex;
    align-items:center;
    height: calc(100vh - 79px);
`

export const FormBox = styled.div`
    display: flex;  
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width:510px;
    margin: 0 auto;  
`

export const ImageWrapper = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    width: 100%; 
    margin-bottom:30px;
`
export const Title = styled.div`
    font-family: Pretendard;
    font-size: 36px;
    font-weight: 700;
    line-height: 43px;
    letter-spacing: 0em;
    text-align: center;
    color:white;
    text-align: center;
    
`

export const Subtitle = styled.div`
    font-family: Pretendard;
    font-size: 24px;
    font-weight: 400;
    line-height: 40px;
    letter-spacing: 0em;
    text-align: center;
    color:white;
    margin: 40px;


`
export const SigninButton = styled.button`
    padding: 9px 20px;
    margin-left: 9px;
    margin-bottom: 12px;
    height: 40px;
    border: 0.5px solid #00F0FF;
    border-radius: 42px;
    cursor: pointer;
    background : #00F0FF;
    color :#464646;
    overflow: hidden;
    font-family: 'Pretendard';
    font-size: 16px;
    width:383px;
    margin: 30px;

`