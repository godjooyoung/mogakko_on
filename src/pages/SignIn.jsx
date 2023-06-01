import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Login } from '../axios/api/login';
import { useMutation } from 'react-query';
import { getCookie } from '../cookie/Cookie';
const SignIn = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwrodError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [islValidationEmail, setIsValidationEmail] = useState(false);
    const [islValidationPassword, setIsValidationPassword] = useState(false);

    const signInMutation = useMutation(Login, {
        onSuccess: () => {
            if(getCookie("token")?true:false) navigate('/')
        }
    })

    const signInUserInfo = {
        email: email,
        password: password
    }
    
    
    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    };

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
        setPasswordError('');
    };

    // email state, password state 변경시 유효성 체크
    useEffect(()=>{
        // email 유효성 체크
        if (!email) {
            // setEmailError('이메일을 입력해주세요');
            setIsValidationEmail(false)
        } else {
            if(!/\S+@\S+\.\S+/.test(email)){
                setEmailError('올바른 이메일 형식이 아닙니다.');
                setIsValidationEmail(false)
            }else{
                setEmailError('');
                setIsValidationEmail(true)
            }
        }
    },[email])
    
    useEffect(()=>{
        // password 유효성 체크
        if (!password) {
            // setPasswordError('비밀번호를 입력해주세요.');
            setIsValidationPassword(false)
        }else{
            if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password)){
                setPasswordError('비밀번호는 대소문자, 숫자, 특수문자를 포함한 8~16자리여야 합니다.');
                setIsValidationPassword(false)
            }else{
                setPasswordError('');
                setIsValidationPassword(true)
            }
        }
    },[password])

    const validationInputHandler = () => {
        if(islValidationEmail && islValidationPassword){
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
            <div>
                <Label>이메일</Label><br />
                <Input
                    type="email"
                    value={email}
                    onChange={emailChangeHandler}
                />
                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}

            </div>
            <div>
                <Label>비밀번호</Label><br />
                <Input
                    type="password"
                    value={password}
                    onChange={passwordChangeHandler}
                />
                {passwrodError && <ErrorMessage>{passwrodError}</ErrorMessage>}

            </div>
            <Button type="submit">로그인</Button>
            {setLoginError && <ErrorMessage>{setLoginError}</ErrorMessage>}

        </Form>
    );
};

export default SignIn;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 0 auto
`;

const Label = styled.label`
    margin-bottom: 0.5rem;
    margin-top: 3rem;
    font-weight: bold;
`;

const Input = styled.input`
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius:4px;
`;

const Button = styled.button`
    padding:0.5rem 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const ErrorMessage = styled.div`
    color: red; 
    margin-top: 0.5rem;
    font-size: 5px;
`;

