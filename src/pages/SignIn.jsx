import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwrodError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');

    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    };

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
        setPasswordError('');
    };

    const submitHandler = async(e) => {
        e.preventDefault();

        if (!email) {
            setEmailError('이메일을 입력해주세요');
            return
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('올바른 이메일 형식이 아닙니다.');
            return;
        }
        if (!password) {
            setPasswordError('비밀번호를 입력해주세요.');
            return;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password)) {
            setPasswordError('비밀번호는 대소문자, 숫자, 특수문자를 포함한 8~16자리여야 합니다.');
            return;
        }

        try {
            const response = await axios.post(process.env.REACT_APP_SERVER_URL+'members/login', {
                email: email,
                password: password
            });
            console.log(response.data);
            if (response.data.message === '로그인 성공'){
                navigate('/');
            }
        }   catch (error) {
            console.error(error);
            setLoginError('로그인에 실패했습니다. 다시 시도해 주세요.')
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

