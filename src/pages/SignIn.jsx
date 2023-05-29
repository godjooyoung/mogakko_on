import React, { useState } from 'react';
import styled from 'styled-components';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    };

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        if (!email) {
            setError('이메일을 입력해주세요');
            return
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('올바른 이메일 형식이 아닙니다.');
            return;
        }
        if (!password) {
            setError('비밀번호를 입력해주세요.');
            return;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password)) {
            setError('비밀번호는 대소문자, 숫자, 특수문자를 포함한 8~20자리여야 합니다.');
            return;
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
                    required />
            </div>
            <div>
                <Label>비밀번호</Label><br />
                <Input
                    type="password"
                    value={password}
                    onChange={passwordChangeHandler}
                    required />
            </div>
            <Button type="submit">로그인</Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}

        </Form>
    );
};

export default SignIn;

const Form = styled.form`
    dlsplay: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 0 auto
`;

const Label = styled.label`
    margin-bottom; 0.5rem;
    font-wight: bold;
`;

const Input = styled.input`
    padding: 0.5rem;
    margin-bottom: 1rem;
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
`;

