import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { login } from '../axios/api/login'
import { useMutation } from 'react-query'
import { getCookie } from '../cookie/Cookie'

const SignIn = () => {

    const navigate = useNavigate()
    
    // 내부 상태
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwrodError, setPasswordError] = useState('')
    // const [loginError, setLoginError] = useState('') 사용 안되고 있어서 주석 처리 했습니다. - sjy
    const [isValidationEmail, setIsValidationEmail] = useState(false)
    const [isValidationPassword, setIsValidationPassword] = useState(false)

    const signInMutation = useMutation(login, {
        onSuccess: () => {
            if(getCookie("token")?true:false) navigate('/')
        },
        onError: (error) => {
            alert(error)
        }
    })

    const signInUserInfo = {
        email: email,
        password: password
    }
    
    
    const emailChangeHandler = (e) => {
        setEmail(e.target.value)
        setEmailError('')
    };

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value)
        setPasswordError('')
    };

    // email state, password state 변경시 유효성 체크
    useEffect(()=>{
        // email 유효성 체크
        if (!email) {
            // setEmailError('이메일을 입력해주세요')
            setIsValidationEmail(false)
        } else {
            if(!/\S+@\S+\.\S+/.test(email)){
                setEmailError('올바른 이메일 형식이 아닙니다.')
                setIsValidationEmail(false)
            }else{
                setEmailError('')
                setIsValidationEmail(true)
            }
        }
    },[email])
    
    useEffect(()=>{
        // password 유효성 체크
        if (!password) {
            // setPasswordError('비밀번호를 입력해주세요.')
            setIsValidationPassword(false)
        }else{
            if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password)){
                setPasswordError('비밀번호는 대소문자, 숫자, 특수문자를 포함한 8~16자리여야 합니다.')
                setIsValidationPassword(false)
            }else{
                setPasswordError('')
                setIsValidationPassword(true)
            }
        }
    },[password])

    const validationInputHandler = () => {
        if(isValidationEmail && isValidationPassword){
            return true
        }else{
            return false
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if(validationInputHandler()){
            signInMutation.mutate(signInUserInfo)
        }else{
            alert('유효성을 확인해주세요')
        }
    };

    return (
        <Form onSubmit={submitHandler}>
            <SigninIntro>
                로그인
            </SigninIntro>
            <div>
                <Label>이메일</Label><br />
                <InputWrapper>
                    <Input
                        type="email"
                        value={email}
                        placeholder="이메일"
                        onChange={emailChangeHandler}
                    />
                </InputWrapper>
                <ErrorMessageContainer>
                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                </ErrorMessageContainer>
            </div>
            <div>
                <Label>비밀번호</Label><br />
                <InputWrapper>
                    <Input
                        type="password"
                        value={password}
                        placeholder="비밀번호"
                        onChange={passwordChangeHandler}
                    />
                </InputWrapper>
                <ErrorMessageContainer>
                    {passwrodError && <ErrorMessage>{passwrodError}</ErrorMessage>}
                </ErrorMessageContainer>
            </div>
            <LoginButton type="submit" disabled={!isValidationEmail||!isValidationPassword}>로그인</LoginButton>
            {/* {setLoginError && <ErrorMessage>{setLoginError}</ErrorMessage>} */}

        </Form>
    );
};

export default SignIn;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 384px;
    margin: 0 auto
`;

export const SigninIntro =styled.div`
    color:white;
    height: 42.96px;
    font-size: 36px;
    margin-bottom: 70px;
    margin-up:100px;
`;
export const Label = styled.label`
    color:white;
    font-size: 24px;
`;
export const InputWrapper = styled.div`
    display: flex;
    align-items: stretch;
    margin-bottom: 15px; 
    margin-top:10px;
`
export const Input = styled.input`
    border-radius:114px;
    padding: 20px;
    border: none;
    width: 384px;
    height: 40px;
    background: #394254;
    color: #FFFFFF;
`;

export const ErrorMessage = styled.div`
    color: #FF635D;
    font-size: 14px;

`;
export const ErrorMessageContainer = styled.div`
    height: 24px;
    margin:10px 0 40px 10px;
    // margin:100px;
    // padding:50px 0 100px 0;
`; 
export const LoginButton = styled.button`
    width:383px;
    padding: 9px 20px;
    margin-left: 9px;
    margin-bottom: 12px;
    height: 40px;
    border: 0.5px solid ${props => props.disabled ? '#4A4F59' : '#00F0FF'}; 
    border-radius: 28px;
    cursor: pointer;
    background : #4A4F59;
    color :#BEBEBE;
    overflow: hidden;
    font-family: 'Pretendard';
    font-style: normal;
    font-size: 16px;
    line-height: 24px;
    margin: auto;

    &:not(:disabled){
        background: #00F0FF;
        color: #464646;
    }
`