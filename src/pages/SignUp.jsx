import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Modal from '../components/SignupModal';

function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [nicknameErrorMessage, setNicknameErrorMessage]= useState('');
    const [emailAvailability, setEmailAvailability] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const sendData = {
        email :email,
        nickname:nickname,
        password:password,
        emailAuth :'',
        role: "ROLE_USER",
    }  
    console.log(sendData);

    const validateEmail = (email) => {
        // 이메일 유효성 검사를 수행합니다.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // 비밀번호 유효성 검사를 수행합니다.
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        return passwordRegex.test(password);
    };

    const emailChangeHandler = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailErrorMessage('');

        if (!validateEmail(newEmail)) {
            setEmailErrorMessage('유효한 이메일 주소를 입력해주세요.');
        } else {
                setEmailErrorMessage('');
        }
    };
    //이메일 중복검사
    const checkEmailExistence = (email) =>{
        axios.get(`/members/signup/checkEmail?email=${email}`)
        .then((response)=>{
            const data = response.data;
            console.log(data);
            if(data.message ==="중복 확인 성공"){
                setEmailErrorMessage('사용할 수 있는 이메일입니다.');
            }else if(data.message === "중복된 이메일 입니다."){
                setEmailErrorMessage('이미 사용 중인 이메일 입니다.')
            }else{
                setEmailErrorMessage('이메일 중복 체크에 실패했습니다.')
            }
        })
        .catch(error => {
            // 오류 처리
            setEmailErrorMessage('이메일 중복 체크에 실패했습니다.');
            console.error('이메일 중복 체크 요청에 실패했습니다:', error);
        });
    };

    const passwordChangeHandler = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordErrorMessage('');      
    };
    useEffect(()=>{
        if (!validatePassword(password)) {
            if(password.length===0){setPasswordErrorMessage('')}
            else{setPasswordErrorMessage('비밀번호는 대소문자, 숫자, 특수문자를 포함한 8~16자리여야 합니다.')};
        } else {
            setPasswordErrorMessage('');
        }
    },[password])
    const confirmPasswordChangeHandler = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);

        if (newConfirmPassword !== password) {
            setConfirmPasswordErrorMessage('비밀번호가 일치하지 않습니다.');
        }else{
            setConfirmPasswordErrorMessage('');

        }
    };

    const nicknameChangeHandler = (e) => {
        const newNickname = e.target.value;
        setNickname(newNickname);
        if (newNickname) {setNicknameErrorMessage('');
        } 
    };
    // const setPopup= ()=>{
    //     open: true,
    //     title: "Confirm",
    //     message: "회원 가입 성공!", 
    //     callback: function(){
    //         navigate("/signin");
        
    // }

    const sendHandler = async(sendData)=>{
        console.log("sendData:",sendData);
       await axios.post(`/members/signup`, sendData)
        .then(response => {
            const data = response.data;
            console.log(data);
            if(data.message === "회원 가입 성공"){
                alert("회원가입 성공하였습니다.")
                navigate("/signin");
            }else{
                alert("회원가입에 실패했습니다. 회원가입을 다시 진행해 주세요.")
            }
        })
        .catch(error => {
          // 데이터 전송 중 오류가 발생했을 때 실행할 코드
          console.error(error);
        });
    }
    
    

    const checkNicknameExistence = (nickname) => {
      // 서버에 닉네임 중복 체크 요청 보내기
      // 예시로 axios를 사용하여 GET 요청을 보내는 방법을 보여드립니다.
      fetch(`members/signup/checkNickname?nickname=${nickname}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.message === '중복 확인 성공') {
            console.log(data.message)
          setNicknameErrorMessage('사용할 수 있는 닉네임입니다.');
        } else if (data.message === '중복된 닉네임입니다.') {
          setNicknameErrorMessage('이미 사용 중인 닉네임입니다.');
        } else {
          setNicknameErrorMessage(data.message); // Update this line
        }
      })
      .catch((error) => {
        setNicknameErrorMessage('닉네임 중복 체크에 실패했습니다.');
        console.error('닉네임 중복 체크 요청에 실패했습니다:', error);
      });
  };

    const isAgreedChangeHandler = (e) => {
        const isAgreed = e.target.checked;
        setIsAgreed(isAgreed);
    };


    const termsButtonClickHandler = () => {
        openModal();
    };
    const openModal = ()=>{
        setModalOpen(true);
    };
    const closeModal=()=>{
        setModalOpen(false);
    };
    const termsContent = `
    [회원 서비스 약관]
    1. 약관 내용 1...
    2. 약관 내용 2...
    3. 약관 내용 3...
    ...
    
    [위치 기반 정보 제공 동의]
    1. 약관 내용 1...
    2. 약관 내용 2...
    3. 약관 내용 3...
    ...

    [만 14세 이상 동의]
    1. 약관 내용 1...
    2. 약관 내용 2...
    3. 약관 내용 3...
    ...
    `;

    return (
        <>
            <Form>  
            {/* <Form onSubmit={submitHandler}> */}
                <div>
                    <Label>이메일</Label>
                </div>
                <div>    
                    <Input
                        type="email"
                        value={email}
                        onChange={emailChangeHandler}
                        placeholder="이메일"
                        required
                    />
                    <button type="button" onClick={() => checkEmailExistence(email)}>
                        중복체크
                    </button>
                </div>
                {emailErrorMessage && <ErrorMessage>{emailErrorMessage}</ErrorMessage>}
                {emailAvailability && <ErrorMessage>{emailAvailability}</ErrorMessage>}
                <div>
                    <Label>비밀번호</Label>
                </div>
                <div>   
                    <Input
                        type="password"
                        value={password}
                        onChange={passwordChangeHandler}
                        placeholder="비밀번호"
                    />
                </div>
                {passwordErrorMessage && <ErrorMessage>{passwordErrorMessage}</ErrorMessage>}

                <div>
                    <Label>비밀번호 확인</Label>
                </div>
                <div>   
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={confirmPasswordChangeHandler}
                        placeholder="비밀번호 재입력"
                    />
                </div>
                {confirmPasswordErrorMessage && <ErrorMessage>{confirmPasswordErrorMessage}</ErrorMessage>}

                <div>
                    <Label>닉네임</Label>
                </div>
                <FormField>       
                    <Input
                        type="text"
                        value={nickname}
                        onChange={nicknameChangeHandler}
                        placeholder="닉네임"
                    />
                    <button type="button" onClick={() => checkNicknameExistence(nickname)}>
                        중복체크
                    </button>
                    {nicknameErrorMessage && <ErrorMessage>{nicknameErrorMessage}</ErrorMessage>}

                </FormField>
                <Wrapper>
                    <Input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={isAgreedChangeHandler}
                    /><BottomButton onClick={termsButtonClickHandler}>회원 서비스(필수), 위치 기반 정보 제공 동의(필수), 만 14세 이상(필수)-navigate</BottomButton>                
                    <Modal open={modalOpen} close={closeModal}>
                        <h2>서비스 이용 약관</h2>
                        <pre>{termsContent}</pre>
                        <button onClick={closeModal}>닫기</button>
                    </Modal>
                
                
                </Wrapper>

                <button onClick={(e)=>{
                    e.preventDefault() //요청전 리로드 방지
                    sendHandler(sendData)
                    }}>회원가입</button>
            </Form>
        </>
    );
}

export default SignUp;

const FormField = styled.div`
    margin-bottom: 20px;
`;

const BottomButton = styled.button`
    padding:0.5rem 1rem;
    background-color:white;    
    color: black;
    text-decoration: underline;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
`;
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

const Wrapper = styled.div`
    display: flex;
    align-items: center;
`