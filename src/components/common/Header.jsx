import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from "styled-components";
import { useNavigate } from 'react-router-dom';
import { getCookie, removeCookie } from '../../cookie/Cookie';
import { EventSourcePolyfill } from "event-source-polyfill";
import { useDispatch, useSelector } from 'react-redux';
import { __alarmSender, __alarmClean } from '../../redux/modules/alarm'
import { __logoutResetUser} from '../../redux/modules/user'
import { __logoutResetSearch } from '../../redux/modules/search'
import { useLocation } from 'react-router-dom'

function Header(props) {
    
    // 전역에 등록된 알람 내역 가져오기
    const alarmInfo = useSelector((state) => {
        return state.alarmInfo
    })

    // hooks
    const navigate = useNavigate();
    const eventSourceRef = useRef(null);
    const location = useLocation();
    const dispatcher = useDispatch()

    // state
    const [isLogin, setIsLogin] = useState(false)
    const [isAlarmWindowOpen, setIsAlarmWindowOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    
    // 신규 알람 카운트
    const [isNewNotification, setIsNewNotification] = useState(alarmInfo.filter((alarm)=>{return alarm.indexOf('EventStream Created') === -1}).length)

    // 신규알람 표시 여부
    const [isNewNoti, setIsNewNoti] = useState(false)
    
    const urlPathname = location.pathname;

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
        if(urlPathname === '/signup' || urlPathname === '/signin'){
            setIsVisible(false)
        }
    })
    
    // 알람 신규로 올때
    useEffect(()=>{

        console.log("알람건수:::::::::::::::  ", isNewNotification)
        if(isNewNotification>1){
            setIsNewNoti(true)
        }else{
            setIsNewNoti(false)
        }
    },[isNewNotification])

    // 알람 창을 열었으면 신규 알람 아이콘 없앤다.
    useEffect(()=>{
        if(isAlarmWindowOpen){
            setIsNewNoti(false)
        }
    },[isAlarmWindowOpen])


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
                        sessionStorage.setItem('isSubscribed', true);
                    })

                    eventSourceRef.current.addEventListener('message', (event) => {
                        console.log("[INFO] SSE message event", event)
                        //SSE message event
                        const data = event.data
                        console.log("[INFO] SSE message data ", data)

                        setIsNewNotification((prevIsNewNotification)=>prevIsNewNotification+1)
                        // if(data.indexOf('EventStream Created') === -1){
                        //     console.log('최초 연결 알람이 아닌 추가 알라밍 발생했습니다!!!!!!!!!!!', data)
                        //     setIsNewNotification((prevIsNewNotification)=>prevIsNewNotification+1)
                        // }

                        dispatcher(__alarmSender(data))
                    })
                    return () => {
                        if (eventSourceRef.current && !isLogin) {
                            console.log("[INFO] SSE Close :::::::::::: ")
                            sessionStorage.setItem('isSubscribed', false)
                            dispatcher(__alarmClean())
                            eventSourceRef.current.close() // 로그아웃 시 SSE 연결 종료
                        }
                    };
                }
            };
            subcribeSSE()
            avataGenHandler()
        }
        if(!isLogin){
            dispatcher(__alarmClean())
        }

    }, [isLogin]);

    // 아바타 생성 함수
    const avataGenHandler = (type, url, userNickName) => {
        let avataGen
        if (!type) {
            avataGen = getCookie('userProfile')
        } else {
            // 알람에 프로필 이미지의 경우
            if (url === 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtArY0iIz1b6rGdZ6xkSegyALtWQKBjupKJQ&usqp=CAU') {
                avataGen = `https://source.boringavatars.com/beam/120/${userNickName}?colors=00F0FF,172435,394254,EAEBED,F9F9FA`
            } else {
                avataGen = url
            }
        }
        return <><img src={avataGen} alt='프로필사진' width='44px' height='44px' /></>
    }

    // 알람내용 생성 함수 
    const alarmCotentHandler = (userNickName, content) => {
        const pos = content.indexOf(userNickName)
        let highLightName
        let nonHighLightContnent
        if(pos!==-1){
            highLightName = content.substr(pos, userNickName.length)
            nonHighLightContnent = content.substr((pos+userNickName.length))
            console.log("######## highLightContnent " ,highLightName)
            console.log("######## nonHighLightContnent " ,nonHighLightContnent)
            return <><span>{highLightName}</span>{nonHighLightContnent}</>
        }else{
            return <>{content}</>
        }
        
    }

    // 알림 내용 컴포넌트 생성 함수
    const renderAlertComponent = () => {
        if (alarmInfo) {
            // 전역 스토어에 저장되어있는 알람 내역
            console.log("[global] alarmInfo > ", alarmInfo)
            
            // 알람 테스트를 위한 목 데이터
            // const alarmInfoTest4 = [
            //     'EventStream Created. [memberId=8]',
            //     'EventStream Created. [memberId=8]',
            //     '{ "id": 7, "senderNickname":"변희준3", "senderProfileUrl":"프로필유알엘", "content": "변희준3님이 친구요청을 보냈습니다.", "url": "/friend/request/determine", "isRead": false, "senderId": 3, "receiverId": 2, "createdAt": "2023-06-03 18:41:21" }',
            //     '{ "id": 7, "senderNickname":"변희준3", "senderProfileUrl":"프로필유알엘", "content": "변희준3님이 친구요청을 보냈습니다.", "url": "/friend/request/determine", "isRead": false, "senderId": 3, "receiverId": 2, "createdAt": "2023-06-03 18:41:21" }',
            //     '{ "id": 7, "senderNickname":"변희준3", "senderProfileUrl":"프로필유알엘", "content": "변희준3님이 친구요청을 보냈습니다.", "url": "/friend/request/determine", "isRead": false, "senderId": 3, "receiverId": 2, "createdAt": "2023-06-03 18:41:21" }'
            // ]

            // EventStream Created 포함하고 있지 않은 알람만 표현해준다.
            const filterAlarm = alarmInfo.filter((alarm)=>{
                return alarm.indexOf('EventStream Created') === -1
            })

            // filterAlarm
            if (filterAlarm.length === 0) {
                return (
                    <>
                        <NoneMessageImg src={`${process.env.PUBLIC_URL}/image/bell.webp`} alt="알람없을때아이콘" />
                        <NoneMessage>아직 온 알람이 없어요!</NoneMessage>
                    </>
                )
            } else {
                return (
                    <>
                        {filterAlarm && filterAlarm.map((alarm) => {
                            return (
                                <AlearmContent>
                                    <ProfileImgDivInAlarm>
                                        <img src={JSON.parse(alarm).senderProfileUrl} alt="프로필사진"  width='44px' height='44px'/>
                                        {/* {avataGenHandler('alearm', JSON.parse(alarm).senderProfileUrl, JSON.parse(alarm).senderNickname)} */}
                                    </ProfileImgDivInAlarm>
                                    <AlearmContentWrap onClick={onClickMyPageHandler}>
                                        <AlearmContentMsg>
                                            {alarmCotentHandler((JSON.parse(alarm).senderNickname), JSON.parse(alarm).content)}
                                            {/* {JSON.parse(alarm).content} */}
                                        </AlearmContentMsg>
                                        <AlearmContentTime>
                                            <span>{JSON.parse(alarm).createdAt}</span>
                                        </AlearmContentTime>
                                    </AlearmContentWrap>

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
            removeCookie('token')
            removeCookie('nickName')
            removeCookie('userProfile')
            sessionStorage.removeItem('isSubscribed')
            dispatcher(__alarmClean())
            if (eventSourceRef.current) {
                eventSourceRef.current.close(); // SSE 연결 종료
            }
        }
        // remove()

        const logoutReset = async () => {
            dispatcher(__alarmClean())
            console.log("로그아웃!!!!")

        }

        const logout = async () => {
            await remove()
            await logoutReset()
            navigate('/')
        }

        logout()
    }
    
    const onClickMyPageHandler = () => {
        navigate('/mypage')
    }
    const onClickAlearmHandler = (isOpend) => {
        setIsAlarmWindowOpen(!isOpend)
    }


    return (
        <CommonHeader pos={props.pos}>
            <ButtonWrap>
                <HeaderLeftContent pos={props.pos}>
                    <Logo src={`${process.env.PUBLIC_URL}/image/logo.webp`} onClick={onClickLogoHandler} />
                    {/* <button onClick={onClickLogoHandler}>로고</button> */}
                </HeaderLeftContent>
                <HeaderRightContent>
                    {!isLogin ? <>
                        {isVisible?<>
                            <HeaderButton onClick={onClickSignInHandler} width={67} marginRight={18}><p>로그인</p></HeaderButton>
                            <HeaderButton onClick={onClickSignUpHandler} width={115} border={true} marginRight={0}><p>회원가입</p></HeaderButton>
                        </>:<></>
                        }
                    </> : <>
                        <HeaderButton onClick={onClickLogOutHandler} width={85} marginRight={10} ><p>로그아웃</p></HeaderButton>
                        <AlearmWrap>
                            <HeaderButton onClick={() => { onClickAlearmHandler(isAlarmWindowOpen) }} marginRight={17} width={40}>
                                {isNewNoti?<NewNoti/>:<></>}
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

                        {/* <HeaderButton onClick={onClickMyPageHandler} marginRight={39}> */}
                        
                            <ProfileImgDiv onClick={onClickMyPageHandler}>
                                {
                                    // console.log("profileImg",profileImg)
                                    //profileImg === '' ? <img src={`${process.env.PUBLIC_URL}/image/profileEmpty.svg`} alt="프로필사진" />:<img src='http://www.gravatar.com/avatar/테스트유저1?d=identicon&s=400' alt="프로필사진" />
                                    avataGenHandler()
                                }
                            </ProfileImgDiv>
                        
                        {/* </HeaderButton> */}
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
    position: ${(props) => {
        return props.pos ? 'absolute' : 'static';
    }};
`
export const ButtonWrap = styled.div`
    display: flex;
    justify-content: space-between;
    height: 100%;
    align-items : center;
`
export const HeaderLeftContent = styled.div`
    margin-left: 40px;
`
export const HeaderRightContent = styled.div`
    display: flex;
    align-items: center;
    margin-right: 40px;
`
export const ProfileImgDiv = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 0 0 1px #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`
export const ProfileImgDivInAlarm = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);
    margin-right: 6px;
`

export const shakeAnimation = keyframes`
    0% { transform: translateX(0); }
    20% { transform: translateX(-3px); }
    40% { transform: translateX(3px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
    100% { transform: translateX(0); }
`

export const HeaderButton = styled.div`
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
    /* border-radius : ${(props) => {
        return props.border ? '52px;' : '0px';
    }}; */
    border-radius : 53px;
    margin-right: ${(props) => {
        return props.marginRight ? props.marginRight + 'px' : 0;
    }};

    &:hover {
        transition: 0.3s;
        background: rgba(0, 0, 0, 0.4);
    }
    &:active {
        transition: 0.2s;
        background: rgba(0, 0, 0, 0.7);
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

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
    /* top: 50px;
    left: -5px; */
    top: 52px;
    left: 1px;
    
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
    z-index: 1;
    overflow: scroll;
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
    display: flex;
    padding: 12px 8px 10px;
`

export const AlearmContentMsg = styled.p`
    font-family: 'Noto Sans';   
    font-style: normal;
    font-weight: 400;
    font-size: 9px;
    line-height: 178%;
    color: #464646;
    width: 139px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow : ellipsis;
    span {
        font-weight: 700;
        color : #00CABE;
    }
`
export const AlearmContentTime = styled.div`
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 7px;
    text-align: right;
    color: #464646;
    display: flex;
    flex-direction: column;
`
export const AlearmContentWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 5px;
    cursor: pointer;
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

export const Logo = styled.img`
    cursor: pointer;
`

export const NewNoti = styled.div`
    width: 10px;
    height: 10px;
    overflow: hidden;
    border-radius: 50%;
    background-color: #FF635D;
    position: absolute;
    top: 5px;
    left: 10px;
    z-index: 1;
`
export default Header;