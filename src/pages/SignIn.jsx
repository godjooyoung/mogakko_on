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
            if (getCookie("token") ? true : false) navigate('/')
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
    useEffect(() => {
        // email 유효성 체크
        if (!email) {
            // setEmailError('이메일을 입력해주세요')
            setIsValidationEmail(false)
        } else {
            if (!/\S+@\S+\.\S+/.test(email)) {
                setEmailError('올바른 이메일 형식이 아닙니다.')
                setIsValidationEmail(false)
            } else {
                setEmailError('')
                setIsValidationEmail(true)
            }
        }
    }, [email])

    useEffect(() => {
        // password 유효성 체크
        if (!password) {
            // setPasswordError('비밀번호를 입력해주세요.')
            setIsValidationPassword(false)
        } else {
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password)) {
                setPasswordError('대소문자, 숫자, 특수문자를 포함한 8~16자리여야 합니다.')
                setIsValidationPassword(false)
            } else {
                setPasswordError('')
                setIsValidationPassword(true)
            }
        }
    }, [password])

    const validationInputHandler = () => {
        if (isValidationEmail && isValidationPassword) {
            return true
        } else {
            return false
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (validationInputHandler()) {
            signInMutation.mutate(signInUserInfo)
        } else {
            alert('유효성을 확인해주세요')
        }
    };

    return (
        <FormDiv>
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
                    <EmailErrorMessageContainer>
                        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                    </EmailErrorMessageContainer>
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
                    <PasswordErrorMessageContainer>
                        {passwrodError && <ErrorMessage>{passwrodError}</ErrorMessage>}
                    </PasswordErrorMessageContainer>
                </div>
                <LoginButton type="submit" disabled={!isValidationEmail || !isValidationPassword}>로그인</LoginButton>
                {/* {setLoginError && <ErrorMessage>{setLoginError}</ErrorMessage>} */}

            </Form>
        </FormDiv>
    );
};

export default SignIn;

export const FormDiv = styled.div`
    display:flex;
    align-items:center;
    height: calc(100vh - 79px);
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 384px;
    margin: 0 auto
`;

export const SigninIntro = styled.div`
    color:white;
    height: 42.96px;
    margin-bottom: 70px;
    margin-up:100px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 36px;
    line-height: 43px;
`;
export const Label = styled.label`
    color:white;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;
`;
export const InputWrapper = styled.div`
    display: flex;
    align-items: stretch;
    margin-bottom: 15px; 
    margin-top:10px;
`
export const Input = styled.input`
    flex-glow: 1;
    padding: 10px 10px 10px 20px;
    border:none;
    outline: none;
    width: 100%;
    height: 40px;
    background: #394254;
    color: #FFFFFF;
    border-radius:114px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
`;


export const ErrorMessage = styled.div`
    color: #FF635D;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;

`;
export const EmailErrorMessageContainer = styled.div`
    height: 24px;
    margin:10px 0 28px 10px;

`;
export const PasswordErrorMessageContainer = styled.div`
    height: 24px;
    margin:10px 0 81px 10px;

`;
export const LoginButton = styled.button`
    width:384px;
    padding: 9px 20px;
    margin: 53px 0 12px 9;
    height: 40px;
    border:none;
    border-radius: 42px;
    cursor: pointer;
    background : #4A4F59;
    color :#BEBEBE;
    overflow: hidden;
    margin: auto;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 16px;
    text-align: center;

    &:not(:disabled){
        background: #00F0FF;
        color: #464646;
    }
    &:hover {
        transform: scale(1.03);
    }
    &:active {
        background-color: #00C5D1;
        transform: scale(1);
    }
`
