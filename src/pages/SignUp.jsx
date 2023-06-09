import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Modal from '../components/SignupModal';
import { BiChevronRight } from "react-icons/bi";
axios.defaults.withCredentials = true;

function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isEmailAvailable, setIsEmailAvailable] = useState(false);
    const [emailChanged, setEmailChanged] = useState(false);



    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const [nicknameChanged, setNicknameChanged] = useState(false);

    const [isAgreed, setIsAgreed] = useState(false);

    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');


    const [modalOpen, setModalOpen] = useState(false);

    const sendData = {
        email: email,
        nickname: nickname,
        password: password,
        emailAuth: '',
        role: "ROLE_USER",
    }
    console.log(sendData);

    const validateEmail = (email) => {
        // 이메일 유효성 검사를 수행합니다.
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

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


        if (validateEmail(newEmail)) {
            setIsEmailValid(true);
            setEmailErrorMessage('');
            setEmailChanged(true);

        } else {
            setIsEmailValid(false);
            setEmailErrorMessage('유효한 이메일 주소를 입력해주세요.');

        }
    };
    //이메일 중복검사
    const checkEmailExistence = (email) => {
        axios.get(process.env.REACT_APP_SERVER_URL + `/members/signup/checkEmail?email=${email}`, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                console.log(data);
                if (data.message === "중복 확인 성공") {
                    setEmailErrorMessage('사용할 수 있는 이메일입니다.');
                    setIsEmailValid(true);
                    setIsEmailAvailable(true);
                    setEmailChanged(false);
                } else if (data.message === "중복된 이메일 입니다.") {
                    setEmailErrorMessage('이미 사용 중인 이메일 입니다.');
                    setIsEmailValid(false);
                    setIsEmailAvailable(false);
                } else {
                    setEmailErrorMessage('이메일 중복 체크에 실패했습니다.');
                    setIsEmailValid(false);


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
        setIsPasswordConfirmed(false);

    };
    useEffect(() => {
        if (!validatePassword(password)) {
            if (password.length === 0) {
                setPasswordErrorMessage('')
                setIsPasswordValid(false);
            } else {
                setPasswordErrorMessage('비밀번호는 대소문자, 숫자, 특수문자를 포함한 8~16자리여야 합니다.')
                setIsPasswordValid(false);
            };
        } else {
            setPasswordErrorMessage('');
            setIsPasswordValid(true);
        }
    }, [password])

    useEffect(() => {
        if (!isPasswordConfirmed && password.length !== 0) {
            setConfirmPasswordErrorMessage('비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmPasswordErrorMessage('');
        }
    }, [isPasswordConfirmed])

    const confirmPasswordChangeHandler = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);

        if (newConfirmPassword !== password) {
            setConfirmPasswordErrorMessage('비밀번호가 일치하지 않습니다.');
            setIsPasswordConfirmed(false);
        } else {
            setConfirmPasswordErrorMessage('');
            setIsPasswordConfirmed(true);
        }
    };

    const nicknameChangeHandler = (e) => {
        const newNickname = e.target.value;
        setNickname(newNickname);
        if (newNickname.length < 4 || newNickname.length > 8) {
            setNicknameErrorMessage('닉네임은 4~8자 사이여야 합니다.');
            setNicknameChanged(false);
        } else {
            setNicknameErrorMessage('')
            setNicknameChanged(true);

        }
    };

    const sendHandler = async (sendData) => {
        console.log("sendData:", sendData);
        await axios.post(process.env.REACT_APP_SERVER_URL + `/members/signup`, sendData, { withCredentials: true })
            .then(response => {
                const data = response.data;
                console.log(data);
                if (data.message === "회원 가입 성공") {
                    navigate("/done");
                } else {
                    alert("회원가입에 실패했습니다. 회원가입을 다시 진행해 주세요.")
                }
            })
            .catch(error => {
                // 데이터 전송 중 오류가 발생했을 때 실행할 코드
                console.error(error);
            });
    }



    const checkNicknameExistence = (nickname) => {
        axios.get(process.env.REACT_APP_SERVER_URL + `/members/signup/checkNickname?nickname=${nickname}`, { withCredentials: true })
            .then((response) => {
                const data = response.data;
                console.log(data);
                if (data.message === '중복 확인 성공') {
                    console.log(data.message);
                    setNicknameErrorMessage('사용할 수 있는 닉네임입니다.');
                    setIsNicknameAvailable(true);
                    setNicknameChanged(false);
                } else if (data.message === '중복된 닉네임입니다.') {
                    setNicknameErrorMessage('이미 사용 중인 닉네임입니다.');
                    setIsNicknameAvailable(false);
                } else {
                    setNicknameErrorMessage(data.message); // Update this line
                    setIsNicknameAvailable(false);
                }
            })
            .catch((error) => {
                setNicknameErrorMessage('닉네임 중복 체크에 실패했습니다.');
                setIsNicknameAvailable(false);
                console.error('닉네임 중복 체크 요청에 실패했습니다:', error);
            });
    };

    const isAgreedChangeHandler = (e) => {
        const isAgreed = e.target.checked;
        setIsAgreed(isAgreed);
    };

    const termsContent=()=>{

    }

    const termsButtonClickHandler = () => {
        openModal();
    };
    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };


    return (
        <>
       
        <FormDiv>
            <Form>
                <SigninIntro>
                    회원가입
                </SigninIntro>
                {/* <Form onSubmit={submitHandler}> */}
                <div>
                    <Label>이메일</Label>
                    <ContainerWrapper>
                        <InputWrapper>
                            <ShortInput
                                type="email"
                                value={email}
                                onChange={emailChangeHandler}
                                placeholder="이메일"
                                required
                            />
                            <ButtonWrapper>
                                <CheckButton type="button" disabled={!emailChanged} onClick={(e) => {
                                    e.preventDefault() //요청전 리로드 방지
                                    checkEmailExistence(email)
                                }}>
                                    중복확인
                                </CheckButton>
                            </ButtonWrapper>
                        </InputWrapper>
                    </ContainerWrapper>

                    <ErrorMessageContainer>
                        {emailErrorMessage === '사용할 수 있는 이메일입니다.' ? <SuccessMessage>{emailErrorMessage}</SuccessMessage> :
                            <ErrorMessage>{emailErrorMessage}</ErrorMessage>}
                    </ErrorMessageContainer>
                </div>
                <div>
                    <Label>비밀번호</Label>
                    <InputWrapper>
                        <Input
                            type="password"
                            value={password}
                            onChange={passwordChangeHandler}
                            placeholder="비밀번호"
                        />

                    </InputWrapper>
                    <ErrorMessageContainer>

                        {passwordErrorMessage && <ErrorMessage>{passwordErrorMessage}</ErrorMessage>}
                    </ErrorMessageContainer>
                </div>

                <div>
                    <Label>비밀번호 확인</Label>
                    <InputWrapper>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={confirmPasswordChangeHandler}
                            placeholder="비밀번호 재입력"
                        />
                    </InputWrapper>
                    <ErrorMessageContainer>
                        {confirmPasswordErrorMessage && <ErrorMessage>{confirmPasswordErrorMessage}</ErrorMessage>}
                    </ErrorMessageContainer>

                </div>
                <div>
                    <Label>닉네임</Label>
                    <InputWrapper>
                        <ShortInput
                            type="text"
                            value={nickname}
                            onChange={nicknameChangeHandler}
                            placeholder="닉네임"
                        />
                        <ButtonWrapper>
                            <CheckButton type="button" disabled={!nicknameChanged} onClick={(e) => {
                                e.preventDefault() //요청전 리로드 방지
                                checkNicknameExistence(nickname)
                            }}>
                                중복확인
                            </CheckButton>
                        </ButtonWrapper>
                    </InputWrapper>
                    <ErrorMessageContainer>
                        {nicknameErrorMessage === '사용할 수 있는 닉네임입니다.' ? <SuccessMessage>{nicknameErrorMessage}</SuccessMessage> :
                            <ErrorMessage>{nicknameErrorMessage}</ErrorMessage>}
                    </ErrorMessageContainer>

                </div>


             
                <Wrapper>
                    
                        <InputCheckbox
                            type="checkbox"
                            checked={isAgreed}
                            onChange={isAgreedChangeHandler}
                        /><Term>개인 위치 정보 제공에 동의합니다.</Term>
               
                    <BottomButton onClick={termsButtonClickHandler}>전체보기  <BiChevronRight /> </BottomButton>
                    <Modal open={modalOpen} close={closeModal}>
                        <h2>서비스 이용 약관</h2>
                        <pre>{termsContent}</pre>
                        <button onClick={closeModal}>닫기</button>

                    </Modal>

                </Wrapper>
                <SignupButton onClick={(e) => {
                    e.preventDefault() //요청전 리로드 방지
                    sendHandler(sendData)
                }}
                    disabled={nicknameChanged || emailChanged || !isEmailValid || !isPasswordValid || !isPasswordConfirmed || !isNicknameAvailable || !isAgreed}
                >
                    회원가입
                </SignupButton>
            </Form>
        </FormDiv>
        </>
    );
}


export default SignUp;

export const FormDiv = styled.div`
    display:flex;
    align-items:center;
    height: calc(100vh - 79px);
`
export const Form = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 384px;
    margin: 0 auto
`;
export const SigninIntro = styled.div`
    color:#FFFFFF;
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
    margin-bottom: 3rem;
    margin-top: 3rem;
    color:white;
    padding-bottom: 8px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;
`;

export const ContainerWrapper = styled.div`
    display:flex;
    justify-content: space-between;

`


export const InputWrapper = styled.div`
    // display: flex;
    // align-items: stretch;
    width: 384px;
    overflow: hidden;
    box-shadow: 0 0 5px rgba(0,0,0,0,3);
    margin-bottom: 15px; 
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    margin-top:10px;

`;

export const ButtonWrapper = styled.div`
    overflow:hidden;
    height: 40px;
    width: 102px;
    display: plex;
    flex-direction: row;
    boder-radius:114px;
    overflow:hidden;
    margin-left:10px;
    text-align: center;

`;


export const ShortInput = styled.input`
    width: 268px;
    height: 40px;
    flex-glow: 1;
    padding: 10px;
    border:none;
    outline: none;
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


export const Input = styled.input`
    flex-glow: 1;
    padding: 10px;
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




export const CheckButton = styled.button`
    padding:10px;
    background: ${props => props.disabled ? '#4A4F59' : '#00F0FF'}; 
    color: ${props => props.disabled ? '#BEBEBE' : '#172435'};
    border: none;
    cursor: pointer;
    flex-grow:0;
    height: 40px;
    width:102px;
    display: flex;
    align-items: center;
    border-radius:114px;
    display :inline-block;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

`;

const ErrorMessageContainer = styled.div`
    height: 20px;
    margin: 5px 0px 30px 5px;
`;

export const ErrorMessage = styled.div`
    color:#ff635d;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
`;

export const SuccessMessage = styled.div`
    color: #00F0FF;
    font-size: 5px;
`
export const SignupButton = styled.button`
    padding: 9px 20px;
    margin-left: 9px;
    margin-bottom: 12px;
    height: 40px;
    border:none;
    border-radius:42px;;
    cursor: pointer;
    background : #4A4F59;
    color :#BEBEBE;
    overflow: hidden;
    font-family: 'Pretendard';
    font-style: normal;
    font-size: 17px;
    line-height: 24px;
    width:383px;
    margin: auto;

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


export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top:10px;
`
export const BottomButton = styled.button`
    padding:0.5rem 1rem;
    background-color:transparent;    
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: right;
    font-size:14px;
    text-decoration: underline;

`;
export const InputCheckbox = styled.input`
    width:18px;
    height:18px;
    accent-color:#00F0FF;
`
export const Term = styled.div`
    padding:0.5rem 1rem;
    background-color:transparent;    
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    font-size:14px;     
`