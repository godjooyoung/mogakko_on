import React from 'react'
import { useState } from 'react'

function SignUp() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = (e) => {
        //여기에서 회원가입 로직 처리: 입력값 백엔드로 전송
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        setAgreeTerms(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder='이메일 입력'
                        required
                    />
                </div>
                <div>
                    <label>이름</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='이름 입력'
                        required //필수입력
                    />
                </div>
                <div>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='비밀번호'
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='비밀번호 확인'
                        required
                    />
                </div>
                <div>
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        required
                    />
                    <label>약관에 동의합니다.</label>
                </div>



                <button type="submit">회원가입을 위한 링크 연결</button>
            </form>
        </>
    );
};


export default SignUp