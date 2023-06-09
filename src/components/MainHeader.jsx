import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes, css } from 'styled-components';
import { __userLocation } from '../redux/modules/search';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../cookie/Cookie';
import useInterval from '../hooks/useInterval';

function MainHeader() {

    // 기본 좌표값 (전역)
    const userInfo = useSelector((state) => {
        return state.userInfo
    })
    const navigate = useNavigate();

    // 내부 상태
    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
        setIsLogin(getCookie('token') ? true : false)
    })

    // 방 생성하기
    const onClickRoomCreateHandler = () => {
        if (isLogin) {
            console.log("#### userInfo", userInfo)
            const state = {
                mySessionId : '',
                myUserName : getCookie('nickName'),
                isDirect : false,
                title : '',
                language : '',
                maxMembers : '',
                isOpened : true,
                password : '',
                latitude : userInfo.userLatitude,
                longitude : userInfo.userLongitude,
                neighborhood : userInfo.userTown,
            };
            navigate('/room', { state: state })
        } else {
            alert('로그인 이후 사용 가능합니다.')
        }
    }

    const completedTitle = useMemo(() => {
        return `모각코를 위한 서비스 플랫폼`;
    }, []);

    const [landingTitle, setLandingTitle] = useState("\u00a0");
    const [count, setCount] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (isCompleted) {
            setCount(completedTitle.length);
        }
    }, [isCompleted, completedTitle.length]);

    useEffect(() => {
        if (isCompleted) {
            return;
        }

        const typingInterval = setInterval(() => {
            if (count >= completedTitle.length) {
                setIsCompleted(true);
                clearInterval(typingInterval);
                return;
            }

            setLandingTitle((prev) => {
                let result = prev ? prev + completedTitle[count] : completedTitle[0];
                setCount((prev) => prev + 1);
                return result;
            });
        }, 250);

        return () => {
            clearInterval(typingInterval);
        };
    }, [completedTitle, count, isCompleted]);

    return (
        <>        
        <MainHeaderWrap bg={`${process.env.PUBLIC_URL}/image/mainBg.webp`}>
            <MainTitleWrap>
                <Content isCompleted={isCompleted}>
                    <FontSize>{landingTitle}</FontSize>
                </Content>
                {/* <div>모각코를 위한 서비스 플랫폼</div> */}
                <FontSize>모각코 ON:</FontSize>
            </MainTitleWrap>
            <MainDescWrap>
                <FontSizeS>근처에 있는 사람들과 모여서 각자 코딩하고</FontSizeS>
                <FontSizeS>서로의 코드를 리뷰하며 성장하는 개발자가 되세요.</FontSizeS>
            </MainDescWrap>
            <MainButtonWrap>
                <CreateRoomButton onClick={onClickRoomCreateHandler}>방 생성하기</CreateRoomButton>
            </MainButtonWrap>
        </MainHeaderWrap>
        </>
        
        
    );
}

const FontSize = styled.p`
    font-size: 40px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 50px;
    line-height: 68px;
    text-align: center;
    color: #FFFFFF;
`
const FontSizeS = styled.p`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 35px;
    /* or 206% */
    text-align: center;
    color: #FFFFFF;
`
export const MainHeardImg = styled.img`
    width: 1280px;
    height: 574px;
`
export const MainHeaderWrap = styled.div`
    width: 1280px;
    height: 574px;
    background: #172435;
    grid-column-start: 1;
    grid-column-end: 3;
    display : flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    /* background-image: url(${(props) => {return props.bg}}); */
    background-size: cover;
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 9.68%, rgba(18, 28, 42, 0.788136) 74.36%, #172435 89.14%), url(${(props) => {return props.bg}});    
    background-position: center;
`
export const MainTitleWrap = styled.div`
    display : flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color : white;
    margin-bottom: 21px;
`
export const MainDescWrap = styled.div`
    display : flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color : white;
    margin-bottom: 30px;
`
export const MainButtonWrap = styled.div`
    display : flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`
export const CreateRoomButton = styled.button`
    width: 223px;
    height: 62px;
    background: #00F0FF;
    font-family: 'Pretendard-Regular';
    border-radius: 52px;
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 16px;
    text-align: center;
    color: #464646;
    border: none;
    &:hover {
        transform: scale(1.03);
    }
    &:active {
        background-color: #00C5D1;
        transform: scale(1);
    }
`

const typingCursor1 = keyframes`
    from {
        border-right: 2px solid white;
    }
    to {
        border-right: 2px solid black;
    }
`;

const typingCursor2 = keyframes`
    from {
        border-right: 2px solid white;
    }
    to {
        border-right: 2px solid black;
    }
`;

const Content = styled.div`
    animation: ${typingCursor1} 1s ease-in-out 0ms 2,
    ${typingCursor2} 1s ease-in-out 450ms infinite;
    ${({ isCompleted }) =>
        isCompleted &&
        css`
    animation: none;
    `}
`;
export default MainHeader
