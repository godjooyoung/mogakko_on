import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import TermsModal from '../components/common/TermsModal.jsx';
import CommonPopup from '../components/common/CommonPopup'

axios.defaults.withCredentials = true;

function SignUp() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    // 내부 상태
    const [isOpen, setIsOpen] = useState(false)
    const [popMsg, setPopMsg] = useState('')
    // 팝업 오픈 함수
    const popupOpenHander = (msg) => {
        setPopMsg((prevPopMsg) => msg)
        setIsOpen(() => true)
    }
    // 팝업 클로즈 함수
    const popupCloseHandler = () => {
        setIsOpen(false)
        // 상태 초기화
        setEmail('')
        setPassword('')
        setEmailErrorMessage('')
        setPasswordErrorMessage('')
        setConfirmPassword('')
        setNickname('')
        setIsAgreed(false)
        // setIsValidationEmail(false)
        // setIsValidationPassword(false)
    }

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
                }
            })
            .catch(error => {
                if (error.response.data.message === "중복된 이메일 입니다.") {
                    setEmailErrorMessage('이미 사용 중인 이메일 입니다.');
                    setIsEmailValid(false);
                    setIsEmailAvailable(false);
                } else {
                    // 오류 처리
                    setEmailErrorMessage('이메일 중복 체크에 실패했습니다.');
                    console.error('이메일 중복 체크 요청에 실패했습니다:', error);
                }
            });
    };
    const passwordChangeHandler = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (newPassword !== confirmPassword && confirmPassword.length !== 0) {
            setConfirmPasswordErrorMessage('비밀번호가 일치하지 않습니다.')
            setIsPasswordConfirmed(false);
        } else {
            setConfirmPasswordErrorMessage('');
            setIsPasswordConfirmed(true);
        }
    };
    useEffect(() => {
        if (!validatePassword(password)) {
            if (password.length === 0) {
                setPasswordErrorMessage('')
                setIsPasswordValid(false);
            } else {
                setPasswordErrorMessage('대소문자, 숫자, 특수문자를 포함한 8~16자리여야 합니다.')
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

    const hasWhitespace = (str) => {
        return /\s/.test(str);
    };

    const nicknameChangeHandler = (e) => {
        const newNickname = e.target.value;
        setNickname(newNickname);
        if (newNickname.length < 2 || newNickname.length > 8) {
            setNicknameErrorMessage('닉네임은 2~8자 사이여야 합니다.');
            setNicknameChanged(false);
        } else if (hasWhitespace(newNickname)) {
            setNicknameErrorMessage('닉네임은 빈 칸을 포함할 수 없습니다.')
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
                popupOpenHander(error.response.data.message)

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

    const modalAgree = () => {
        setIsAgreed(true);
        closeModalHandler();
    };

    const openModalHandler = () => {
        setModalOpen(true);
    };
    const closeModalHandler = () => {
        setModalOpen(false);
    };

    return (
        <>
            {
                isOpen ?
                    <CommonPopup msg={popMsg} closeHander={popupCloseHandler} isBtns={false} priMsg={'확인'} priHander={popupCloseHandler} />
                    : <></>
            }

            <FormDiv>
                <Form>
                    <SigninIntro>
                        회원가입
                    </SigninIntro>
                    {/* <Form onSubmit={submitHandler}> */}
                    <div style={{
                        height: '125px'
                    }}>
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
                    <div style={{
                        height: '125px'
                    }}>
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

                    <div style={{
                        height: '125px'
                    }}>
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
                        <NicknameErrorMessageContainer>
                            {nicknameErrorMessage === '사용할 수 있는 닉네임입니다.' ? <SuccessMessage>{nicknameErrorMessage}</SuccessMessage> :
                                <ErrorMessage>{nicknameErrorMessage}</ErrorMessage>}
                        </NicknameErrorMessageContainer>

                    </div>

                    <Wrapper>
                        <div>
                            <InputCheckbox
                                type="checkbox"
                                checked={isAgreed}
                                onChange={isAgreedChangeHandler}
                                id="checkbox"
                            />
                            <InfoButton htmlFor="checkbox">
                                개인 위치 정보 제공에 동의합니다.
                            </InfoButton>
                        </div>
                        <div>
                            <Terms onClick={openModalHandler}>전문보기</Terms>
                            {modalOpen &&
                                <TermsModal
                                    onClose={closeModalHandler}
                                    onAgree={modalAgree}
                                />
                            }
                        </div>

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
};


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
    margin: 0 auto;
`;
export const SigninIntro = styled.div`
    color:#FFFFFF;
    height: 42.96px;
    margin-bottom: 40px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 36px;
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
`;

export const ContainerWrapper = styled.div`
    display:flex;
    justify-content: space-between;

`


export const InputWrapper = styled.div`
    width: 384px;
    margin-bottom: 5px; 
    display:flex;
    justify-content: space-between;
    margin-top:10px;
`;

export const ButtonWrapper = styled.div`
    height: 40px;
    width: 102px;
    display: plex;
    flex-direction: row;
    overflow:hidden;
    margin-left:10px;
    text-align: center;
`;


export const ShortInput = styled.input`
    width: 268px;
    height: 40px;
    padding: 10px 10px 10px 20px;
    border:none;
    outline: none;
    background: var(--bg-li);
    color: #FFFFFF;
    border-radius:114px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    &::placeholder{
        color: #BEBEBE;
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
    }
`;


export const Input = styled.input`
    padding: 10px 10px 10px 20px;
    border:none;
    outline: none;
    width: 100%;
    height: 40px;
    background: var(--bg-li);
    color: #FFFFFF;
    border-radius:114px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 5px; 
    &::placeholder{
        color: #BEBEBE;
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
    }
`;




export const CheckButton = styled.button`
    padding:10px;
    background: ${props => props.disabled ? '#4A4F59' : '#00F0FF'}; 
    color: ${props => props.disabled ? '#BEBEBE' : '#464646'};
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
    font-weight: 700;
    font-size: 16px;
    transition: all 0.3s;
`;

export const ErrorMessageContainer = styled.div`
    height: 20px;
    margin: 5px 0px 30px 5px;
`;

export const NicknameErrorMessageContainer = styled.div`
    height: 20px;
    margin: 10px 0px 10px 5px;
`;

export const ErrorMessage = styled.div`
    color:#ff635d;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
`;

export const SuccessMessage = styled.div`
    color: #00F0FF;
    font-size: 14px;
`;


export const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* margin-bottom:10px; */
    margin-bottom:12px;
`
export const InputCheckbox = styled.input`
    width: 18px;
    height: 18px;
    position: absolute;
    opacity: 0;
    z-index: -1;

    & + label {
        position: relative;
        padding-left: 30px;
        cursor: pointer;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 18px;
            height: 18px;
            border: 1px solid #FFFFFF;
            border-radius: 2px;
            background: transparent;
            transition: all 0.3s;
        }

        &::after {
            content: '';
            position: absolute;
            left: 4px;
            top: -1px;
            width: 10px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
            opacity: 0;
            transition: all 0.3s;
        }
    }

    &:checked + label::before {
        border: none;
        background: #00EFFF;
    }

    &:checked + label::after {
        opacity: 1;
    }
`;

// export const InputCheckbox = styled.input`
//     width:18px;
//     height:18px;
//     accent-color:#00F0FF;
//     border: 1px solid #FFFFFF;
//     border-radius: 2px; 
    
//     overflow: hidden;
//     clip: rect(1px, 1px, 1px, 1px);

//     & + label {
//         position: relative;
//         padding-left: 30px;
//         cursor: pointer;

//         &:before {
//             content: '';
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 20px;
//             height: 20px;
//             border: 1px solid #FFFFFF;
//             border-radius: 2px;
//             background: transparent;
//         }
//     }

//     &:checked + label:before {
//         background: #FFFFFF;
//     }
//     }
// `

export const InfoButton = styled.label`
    /* padding:0.5rem 1rem; */
    background-color:transparent;    
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    /* text-align: right; */
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    /* line-height: 17px;
    display: flex;
    align-items: center; */

`;

export const Terms = styled.span`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #BEBEBE;
    text-decoration: underline;
    cursor: pointer;
`;

export const SignupButton = styled.button`
    padding: 9px 20px;
    margin-top: 10px;
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
    width:383px;
    margin: auto;
    font-weight: 700;
    transition: all 0.3s;
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
        color: #464646;
        font-family: 'Pretendard';
        font-style: normal;
        font-size: 17px;
        font-weight: 700;
    }
`
