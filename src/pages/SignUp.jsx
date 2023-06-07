import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Modal from '../components/SignupModal';
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
        setPasswordErrorMessage('');
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
        if (newNickname.length<4) {
            setNicknameErrorMessage('닉네임이 너무 짧습니다. 4자 이상이어야 합니다.');
            setNicknameChanged(false);
        }else{
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
                    alert("회원가입 성공하였습니다.")
                    navigate("/signin");
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


    const termsButtonClickHandler = () => {
        openModal();
    };
    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
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
                    <ContainerWrapper>
                        <InputWrapper>
                            <Input
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
                                    중복체크
                                </CheckButton>
                            </ButtonWrapper>
                        </InputWrapper>
                    </ContainerWrapper>

                    <ErrorMessageContainer>
                        {emailErrorMessage==='사용할 수 있는 이메일입니다.'? <SuccessMessage>{emailErrorMessage}</SuccessMessage>: 
                        <ErrorMessage>{emailErrorMessage}</ErrorMessage>}        
                    </ErrorMessageContainer>
                </div>
                <div>
                    <Label>비밀번호</Label>
                    <PasswordWrapper>
                        <Input
                            type="password"
                            value={password}
                            onChange={passwordChangeHandler}
                            placeholder="비밀번호"
                        />

                    </PasswordWrapper>
                    <ErrorMessageContainer>
                      
                        {passwordErrorMessage && <ErrorMessage>{passwordErrorMessage}</ErrorMessage>}
                    </ErrorMessageContainer>
                </div>

                <div>
                    <Label>비밀번호 확인</Label>
                    <PasswordWrapper>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={confirmPasswordChangeHandler}
                            placeholder="비밀번호 재입력"
                        />
                    </PasswordWrapper>
                    <ErrorMessageContainer>
                        {confirmPasswordErrorMessage && <ErrorMessage>{confirmPasswordErrorMessage}</ErrorMessage>}
                    </ErrorMessageContainer>

                </div>
                <div>
                    <Label>닉네임</Label>
                    <InputWrapper>
                        <Input
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
                                중복체크
                            </CheckButton>
                        </ButtonWrapper>
                    </InputWrapper>
                    <ErrorMessageContainer>
                        {nicknameErrorMessage==='사용할 수 있는 닉네임입니다.'?  <SuccessMessage>{nicknameErrorMessage}</SuccessMessage>:
                        <ErrorMessage>{nicknameErrorMessage}</ErrorMessage>}
                    </ErrorMessageContainer>

                </div>
                <Wrapper>
                    <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={isAgreedChangeHandler}
                    /><BottomButton onClick={termsButtonClickHandler}>회원 서비스(필수), 위치 기반 정보 제공 동의(필수), 만 14세 이상(필수)</BottomButton>
                    <Modal open={modalOpen} close={closeModal}>
                        <h2>서비스 이용 약관</h2>
                        <pre>{termsContent}</pre>
                        <button onClick={closeModal}>닫기</button>
                    </Modal>


                </Wrapper><br />

                <SignupButton onClick={(e) => {
                    e.preventDefault() //요청전 리로드 방지
                    sendHandler(sendData)
                }}
                    disabled={nicknameChanged || emailChanged || !isEmailValid || !isPasswordValid || !isPasswordConfirmed || !isNicknameAvailable || !isAgreed}
                >
                    회원가입
                </SignupButton>
            </Form>
        </>
    );
}
//중복체크까지 잘하고 회원가입이 활성화된 상태에서 저 칸 중의 하나라도 바뀌면 회원가입이 비활성화되야 하는데...
// 이메일 고치고 비밀번호 고치거나 닉네임 고쳐도 회원가입 활성화상태다. 
// 중복체크 한 뒤 이메일이나 닉네임 수정하면->에러메세지가 "다시 중복체크가 필요합니다."
// 비밀번호가 바뀌면 아래있는 비밀번호와 달라도 다르다는 메세지 안 나옴. 
// 회원가입 disabled만드는 값들을 수정되는 순간 false가 되어야 하고.



export default SignUp;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 0 auto
`;

export const Label = styled.label`
    margin-bottom: 3rem;
    margin-top: 3rem;
    color:white;
    padding-bottom: 8px;
    
`;

export const ContainerWrapper=styled.div`
    display:flex;
    justify-content: space-between;
    
`
export const BottomButton = styled.button`
    padding:0.5rem 1rem;
    background-color:transparent;    
    color: white;
    text-decoration: underline;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
`;


export const InputWrapper = styled.div`
    // display: flex;
    // align-items: stretch;
    width: 300px;
    overflow: hidden;
    box-shadow: 0 0 5px rgba(0,0,0,0,3);
    margin-bottom: 15px; 
    // height: 40px;
    display:flex;
    flex-direction:row;
    // margin-right: 5px;
    justify-content: space-between;

`;

export const ButtonWrapper = styled.div`
    overflow:hidden;
    height: 40px;
    display: plex;
    flex-direction: row;
    boder-radius:10px;
    overflow:hidden;
    margin-left:10px;

`;
export const PasswordWrapper = styled(InputWrapper)`
    
`;


export const Input = styled.input`
    flex-glow: 1;
    padding: 10px;
    border: solid 0.5px #394254;
    outline: none;
    width: 100%;
    height: 40px;
    background: #394254;
    color: #FFFFFF;
    border-radius:4px;
    box-sizing: border-box;
`;

export const CheckButton = styled.button`
    padding:10px;
    background: ${props => props.disabled ? 'transparent' : '#00F0FF'}; 
    color: ${props => props.disabled ? 'white' : '#172435'};
    border:  ${props => props.disabled ? '0.5px solid white' : '#00F0FF'};
    cursor: pointer;
    flex-grow:0;
    height: 40px;
    display: flex;
    align-items: center;
    border-radius:4px;
`;

const ErrorMessageContainer = styled.div`
    height: 20px;
`;

export const ErrorMessage = styled.div`
    color:red;
    font-size: 5px;
`;

export const SuccessMessage=styled.div`
    color: #00F0FF;
    font-size: 5px;
`
export const SignupButton = styled.button`
    padding: 9px 20px;
    margin-left: 9px;
    margin-bottom: 12px;
    /* text-align: center; */
    /* gap: 10px; */
    // min-width: 72px;
    height: 42px;
    border: 0.5px solid #FFFFFF;
    border-radius: 28px;
    cursor: pointer;
    background : transparent;
    color :#FFFFFF;
    overflow: hidden;
    font-family: 'Pretendard';
    font-style: normal;
    // font-weight: 700;
    font-size: 17px;
    line-height: 24px;
    width:200px;
    margin: auto;

    &:not(:disabled){
        background: #00F0FF;
        color: #464646;
    }
`


export const Wrapper = styled.div`
    display: flex;
    align-items: center;
`

