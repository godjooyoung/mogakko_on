import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getCookie, removeCookie } from '../../cookie/Cookie';

function Header() {
    const [isLogin, setIsLogin] = useState(false)
    const [isAlarmWindowOpen, setIsAlarmWindowOpen] = useState(false)
    const navigate = useNavigate();

    useEffect(()=>{
        setIsLogin(getCookie('token')?true:false)
    })

    // SSE
    useEffect(() => {
        // 로그인 상태일때 최초 한번만 구독 실행
        if(isLogin){
            console.log("[SSE] 구독요청")
            const eventSource = new EventSource(
                `${process.env.REACT_APP_SERVER_URL}/api/subscribe`, 
                {
                    headers : {
                        ACCESS_KEY : getCookie('token'),
                    },
                    withCredentials: true, // 토큰 값 전달을 위해 필요한 옵션
                }
            )
            eventSource.addEventListener('message', (event) => {
                const data = JSON.parse(event.data)
                console.log("[SSE] message ", data)
                // 메세지 응답 처리
            })
        
            return () => {
              eventSource.close(); // 컴포넌트 언마운트 시 SSE 연결 종료
            };
        }
    }, [isLogin]);

    const onClickLogoHandler = () => {
        navigate('/')
    }
    const onClickSignUpHandler = () => {
        navigate('/signup')
    }
    const onClickSignInHandler = () => {
        navigate('/signin')
    }
    const onClickLogOutHandler = () => {
        // 로그아웃 처리 쿠키 삭제
        removeCookie('token')
        removeCookie('nickName')
        navigate('/')
    }
    const onClickMyPageHandler = () => {
        navigate('/mypage')
    }
    const onClickAlearmHandler = (isOpend) => {
        setIsAlarmWindowOpen(!isOpend)
    }

    return (
        <CommonHeader>
            <ButtonWrap>
                <button onClick={onClickLogoHandler}>로고</button>
                <HeaderRightContent>
                    {!isLogin?<>
                        <button onClick={onClickSignUpHandler}>회원가입</button>
                        <button onClick={onClickSignInHandler}>로그인</button>
                    </>:<>
                            <button onClick={onClickLogOutHandler}>로그아웃</button>
                            <button onClick={onClickMyPageHandler}>마이페이지</button>
                            <AlearmWrap>
                                <button onClick={()=>{onClickAlearmHandler(isAlarmWindowOpen)}}>알람</button>
                                {!isAlarmWindowOpen?<></>:
                                <>
                                    <AlearHeader></AlearHeader>
                                    <AlearWrapContent>
                                    <AlearTitle>알림</AlearTitle>
                                    </AlearWrapContent>
                                </>
                                }
                            </AlearmWrap>
                        </>
                    }
                </HeaderRightContent>
            </ButtonWrap>
        </CommonHeader>
    );
}

export const CommonHeader = styled.header`
    background: purple;
    color : white;
    width : 100%;
    height : 50px;
`
export const ButtonWrap = styled.div`
    display: flex;
    justify-content: space-between;
    height: 100%;
    align-items : center;
`
export const HeaderRightContent = styled.div`
    
`

export const AlearmWrap = styled.div`
    position: relative;
    display: inline-block;
`

export const AlearHeader = styled.div`
    width: 40px;
    height: 40px;
    position: absolute;
    top: 40px;
    left: -40px;
    background-color: #EDF5FF;
    transform: rotate(-45deg); 
    border-top-right-radius: 6px;
`

export const AlearWrapContent = styled.div`
    width: 200px;
    height: 250px;
    position: absolute;
    top: 50px;
    right: 5px;
    background-color: #EDF5FF;
    border-radius: 6px;
`

export const AlearTitle = styled.p`
    font-size: 14px;
    color: black;
    padding-top: 5px;
    padding-left: 5px;
    box-sizing: border-box;
`
export default Header;