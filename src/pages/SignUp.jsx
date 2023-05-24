import React from 'react'
import { useState } from 'react'

function SignUp() {
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [nickname, setNickname] =useState('');
    const [confirmPassword, setConfirmPassword]=useState('');
    const [agreeTerms, setAgreeTerms]=useState(false);

    const EmailChangeHandler = (e) => {
      setEmail(e.target.value);
    };

    const NicknameChangeHandler = (e) => {
      setEmail(e.target.value);
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
  
      // 약관 동의 여부 확인
      if (!agreeTerms) {
        alert('약관에 동의해야 합니다.');
        return;
      }
  
      // 회원가입 로직 처리
      // ...
  
      // 폼 제출 후 필드 초기화
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgreeTerms(false);
    };
  
  return (
    <>
      <form onSubmit={SubmitHandler}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={EmailChangeHandler}
            placeholder='이메일 입력'
            required
          />
        </div>  
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={PasswordChangeHandler}
            placeholder='비밀번호'
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={ConfirmPasswordChangeHandler}
            placeholder='비밀번호 확인'
            required
          />
        </div>  
        <div>
          <label>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={NicknameChangeHandler}
            placeholder='닉네임 입력'
            required //필수입력
          />
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



        <button type="submit">회원가입을 위한 링크 연결</button>
      </form>
      <div>깃 커밋 충돌 TEST</div>
    </>
  );
};


export default SignUp
