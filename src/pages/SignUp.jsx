import React from 'react'
import { useState } from 'react'

function SignUp() {
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [nickname, setNickname] =useState('');
    const [confirmPassword, setConfirmPassword]=useState('');
    const [agreeTerms, setAgreeTerms]=useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [emailStatus, setEmailStatus] = useState('');

  // var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;


    const checkEmailExistence = async (email) => {
        try {
          const response = await fetch('/api/check-email', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error('이메일 중복 체크에 실패했습니다.');
          }
    
          const data = await response.json();
          return data.exists;
        } catch (error) {
          console.error(error);
          return false;
        }
      };
    const handleEmailCheck = async () => {
        const exists = await checkEmailExistence(email);
        if (exists) {
          setErrorMessage('이미 가입된 이메일입니다.');
        } else {
          setErrorMessage('사용 가능한 이메일입니다.');
        }
      };
    
    const EmailChangeHandler = (e) => {
      setEmail(e.target.value);
    };

    const NicknameChangeHandler = (e) => {
      setNickname(e.target.value);
    };
    const PasswordChangeHandler = (e) => {
      setPassword(e.target.value);
    };
  
    const ConfirmPasswordChangeHandler = (e) => {
      setConfirmPassword(e.target.value);
    };
  
    const AgreeTermsChangeHandler = (e) => {
      setAgreeTerms(e.target.checked);
    };
  
    const SubmitHandler = (e) => {
      e.preventDefault();
        console.log(Object.fromEntries);
      // 약관 동의 여부 확인
      if (!agreeTerms) {
        alert('약관에 동의해야 합니다.');
        return;
      }
      if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      // 폼 제출 후 필드 초기화
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setNickname('');
      setAgreeTerms(false);
    };
  
  return (
    <>
      <form onSubmit={SubmitHandler}>
        <div>
          <label>이메일</label><br/>
          <input
            type="email"
            value={email}
            onChange={EmailChangeHandler}
            placeholder='이메일 입력'
            required
          />
         <button >중복체크</button>

        </div>  
        <div>
          <label>비밀번호</label><br/>
          <input
            type="password"
            value={password}
            onChange={PasswordChangeHandler}
            placeholder='비밀번호'
            errorMessage = "비밀번호는 소문자,대문자,특수문자~~~"
            // pattern=/^[A-Za-z0-9]{8,20}$/
          /><br/>
          <input
            type="password"
            value={confirmPassword}
            onChange={ConfirmPasswordChangeHandler}
            placeholder='비밀번호 확인'
            required
          />
        </div>  
        <div>
          <label>닉네임</label><br/>
          <input
            type="text"
            value={nickname}
            onChange={NicknameChangeHandler}
            placeholder='닉네임 입력'
            required //필수입력
          />
          <button >중복체크</button>

        </div>
        <div>
          <input
            type= "checkbox"
            checked= {agreeTerms}
            onChange={AgreeTermsChangeHandler}
            required
            />
            <label>약관에 동의합니다.</label>
        </div>



        <button type="submit">이메일로 인증 링크 받기</button>
      </form>
    </>
  );
};


export default SignUp
