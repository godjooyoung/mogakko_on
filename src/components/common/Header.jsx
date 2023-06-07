import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from "styled-components";
import { useNavigate } from 'react-router-dom';
import { getCookie, removeCookie } from '../../cookie/Cookie';
import { EventSourcePolyfill } from "event-source-polyfill";
import { useDispatch, useSelector } from 'react-redux';
import { __alarmSender, __alarmClean } from '../../redux/modules/alarm'

function Header() {
    const [isLogin, setIsLogin] = useState(false)
    const [isAlarmWindowOpen, setIsAlarmWindowOpen] = useState(false)
    const navigate = useNavigate();
    const eventSourceRef = useRef(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            console.log("[INFO] 로그인 여부 체크 실행")
            const accessKey = await getCookie('token');
            if (accessKey && !isLogin) {
                setIsLogin(accessKey ? true : false)
            } else if (!accessKey) {
                setIsLogin(false)
            }
        }
        checkLoginStatus()
    })

    const dispatcher = useDispatch()
    
    // 전역에 등록된 알람 내역 가져오기
    const alarmInfo = useSelector((state) => {
        return state.alarmInfo
    })

    useEffect(() => {
        // 세션 스토리지에서 SSE 구독 상태를 확인
        const isSubscribed = sessionStorage.getItem('isSubscribed');
        console.log("[INFO] SSE isSubscribed", isSubscribed)
        console.log("[INFO] SSE alarmInfo", alarmInfo)

        if (isLogin && !isSubscribed) {
            // 로그인 상태일때 최초 한번만 구독 실행
            const subcribeSSE = async () => {
                const accessKey = await getCookie('token')
                console.log("[INFO] SSE 구독요청 - accessKey 가져오기", accessKey)

                const EventSource = EventSourcePolyfill
                if (isLogin && accessKey && !isSubscribed) {
                    console.log("[INFO] SSE 구독요청 ")
                    eventSourceRef.current = new EventSource(
                        //헤더에 토큰
                        `${process.env.REACT_APP_SERVER_URL}/sse/subscribe`,
                        {
                            headers: {
                                'ACCESS_KEY': accessKey,
                            },
                            withCredentials: true, // 토큰 값 전달을 위해 필요한 옵션
                        }
                    )

                    console.log("[INFO] SSE", eventSourceRef.current.withCredentials);
                    console.log("[INFO] SSE", eventSourceRef.current.readyState);
                    console.log("[INFO] SSE", eventSourceRef.current.url);

                    if (eventSourceRef.current.readyState === 1) {
                        console.log("[INFO] SSE connection 상태")
                    }

                    eventSourceRef.current.addEventListener('open', (event) => {
                        console.log("[INFO] SSE connection opened", event)
                        // 연결이 열렸을 때 실행할 코드 작성
                        sessionStorage.setItem('isSubscribed', true);
                    })

                    eventSourceRef.current.addEventListener('message', (event) => {
                        console.log("[INFO] SSE message event", event)
                        const data = event.data
                        console.log("[INFO] SSE message data ", data)
                        dispatcher(__alarmSender(data))
                        // 메세지 응답 처리
                        // TODO 화면에 붙여주기
                        //EventStream Created. [memberId=1]
                        //{"id":7,"content":"변희준3님이 친구요청을 보냈습니다.","url":"/friend/request/determine","isRead":false,"senderId":3,"receiverId":2,"createdAt":"2023-06-03 18:41:21"}
                        //{"id":11,"content":"변희준5님이 친구요청을 보냈습니다.","url":"/friend/request/determine","isRead":false,"senderId":7,"receiverId":1,"createdAt":"2023-06-04 08:02:17"}
                        //setAlarmData(data);
                    })
                    return () => {
                        if (eventSourceRef.current && !isLogin) {
                            sessionStorage.setItem('isSubscribed', false);
                            dispatcher(__alarmClean())
                            eventSourceRef.current.close(); // 로그아웃 시 SSE 연결 종료
                        }
                    };
                }
            };
            subcribeSSE();
        }

    }, [isLogin]);

    // 알림 내용 컴포넌트 생성 함수
    const renderAlertComponent = () => {
        if (alarmInfo) {
            console.log("alarmInfo..", alarmInfo)
            console.log("alarmInfo[0]", alarmInfo?.[0])
            const alarmInfoTest1 = ['EventStream Created. [memberId=8]', '{ "id": 7, "content": "변희준3님이 친구요청을 보냈습니다.", "url": "/friend/request/determine", "isRead": false, "senderId": 3, "receiverId": 2, "createdAt": "2023-06-03 18:41:21" }']
            const alarmInfoTest2 = ['EventStream Created. [memberId=8]']
            const alarmInfoTest3 = ['EventStream Created. [memberId=8]', 'EventStream Created. [memberId=8]']
            const slicedArray = alarmInfo.slice(1);
            if(slicedArray.length === 0){
                return (
                    <>
                        <NoneMessageImg src={`${process.env.PUBLIC_URL}/image/bell.webp`} alt="알람없을때아이콘" />
                        <NoneMessage>아직 온 알람이 없어요!</NoneMessage>
                    </>
                )
            }else{
                return (
                    <>
                        {slicedArray && slicedArray.map((alarm) => {
                            return (
                                <AlearmContent>
                                    <AlearmContentMsg>
                                        {JSON.parse(alarm).content}
                                    </AlearmContentMsg>
                                    <AlearmContentTime>
                                        {JSON.parse(alarm).createdAt}
                                    </AlearmContentTime>
                                </AlearmContent>
                            )
                        })}
                    </>
                );
            }
        }
        return (
            <>
                <NoneMessageImg src={`${process.env.PUBLIC_URL}/image/bell.webp`} alt="알람없을때아이콘" />
                <NoneMessage>아직 온 알람이 없어요!</NoneMessage>
            </>
        );
    };

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
        const remove = async () => {
            await removeCookie('token')
            await removeCookie('nickName')
            await sessionStorage.removeItem('isSubscribed')
            dispatcher(__alarmClean())
            if (eventSourceRef.current) {
                eventSourceRef.current.close(); // SSE 연결 종료
            }
        }
        remove()
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
                <HeaderLeftContent>
                    <button onClick={onClickLogoHandler}>로고</button>
                </HeaderLeftContent>
                <HeaderRightContent>
                    {!isLogin ? <>
                        <HeaderButton onClick={onClickSignInHandler} width={67} marginRight={18} >로그인</HeaderButton>
                        <HeaderButton onClick={onClickSignUpHandler} width={115} border={true} marginRight={40} >회원가입</HeaderButton>
                    </> : <>
                        <HeaderButton onClick={onClickLogOutHandler} width={67} marginRight={18} >로그아웃</HeaderButton>
                        <AlearmWrap>
                            <HeaderButton onClick={() => { onClickAlearmHandler(isAlarmWindowOpen) }} marginRight={17}>
                                <AlearmImg src={`${process.env.PUBLIC_URL}/image/alearmBtn.svg`} alt="알람버튼" />
                            </HeaderButton>
                            {!isAlarmWindowOpen ? <></> :
                                <>
                                    <AlearHeader></AlearHeader>
                                    <AlearWrapContent>
                                        <AlearTitle>알림</AlearTitle>
                                        {renderAlertComponent()}
                                    </AlearWrapContent>
                                </>
                            }
                        </AlearmWrap>

                        <HeaderButton onClick={onClickMyPageHandler} marginRight={39}>
                            <ProfileImgDiv>
                                <img src={`${process.env.PUBLIC_URL}/image/profileEmpty.svg`} alt="프로필사진" />
                            </ProfileImgDiv>
                        </HeaderButton>
                    </>
                    }
                </HeaderRightContent>
            </ButtonWrap>
        </CommonHeader>
    );
}

export const CommonHeader = styled.header`
    background: transparent;
    color: #FFFFFF;
    width : 100%;
    height: 79px;
`
export const ButtonWrap = styled.div`
    display: flex;
    justify-content: space-between;
    height: 100%;
    align-items : center;
`
export const HeaderLeftContent = styled.div`
    
`
export const HeaderRightContent = styled.div`
    
`
export const ProfileImgDiv = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
`

export const shakeAnimation = keyframes`
    0% { transform: translateX(0); }
    20% { transform: translateX(-3px); }
    40% { transform: translateX(3px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
    100% { transform: translateX(0); }
`

export const HeaderButton = styled.button`
    border: 0;
    background-color: transparent;
    color: #FFFFFF;
    height: 40px;

    width : ${(props) => {
        return props.width + 'px';
    }};
    border : ${(props) => {
        return props.border ? '1px solid #FFFFFF;' : '0';
    }};
    border-radius : ${(props) => {
        return props.border ? '52px;' : '0px';
    }};
    margin-right: ${(props) => {
        return props.marginRight ? props.marginRight + 'px' : 0;
    }};
`
export const AlearmImg = styled.img`
    position: relative;
    display: inline-block;
    
    transition: all 0.3s;

    &:hover {
        animation: ${shakeAnimation} 0.6s;
    }
`

export const AlearmWrap = styled.div`
    position: relative;
    display: inline-block;
`

export const AlearHeader = styled.div`
    width: 40px;
    height: 40px;
    position: absolute;
    /* top: 40px;
    left: -40px; */
    background-color: #F9F9FA;
    transform: rotate(-45deg); 
    border-top-right-radius: 6px;
    top: 50px;
    left: -5px;
    
`

export const AlearWrapContent = styled.div`
    width: 200px;
    height: 250px;
    position: absolute;
    /* top: 50px;
    right: 5px; */
    border-radius: 10px;
    top: 55px;
    right: -10px;
    width: 239px;
    height: 373.95px;
    background-color: #F9F9FA;
`

export const AlearTitle = styled.p`
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 114%;

    color: #464646;
    padding-top: 16px;
    padding-left: 19px;
    box-sizing: border-box;
    margin-bottom: 3px;
`
export const AlearmContent = styled.div`
    width: 209px;   
    height: 66px;
    background: #FFFFFF;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    margin : 10px 13px 10px 13px;
    padding: 12px;
`

export const AlearmContentMsg = styled.p`
    font-family: 'Noto Sans';   
    font-style: normal;
    font-weight: 400;
    font-size: 9px;
    line-height: 178%;
    color: #464646;
`
export const AlearmContentTime = styled.p`
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 7px;
    line-height: 229%;
    text-align: right;
    color: #464646;
`

export const NoneMessageImg = styled.img`
    margin: 102px 93px 12px;

`
export const NoneMessage = styled.p`
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 160%;
    text-align: center;
    color: #BEBEBE;
`

export default Header;