import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { styled } from 'styled-components';
import { __userLocation } from '../redux/modules/search';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../cookie/Cookie';

function MainHeader() {

    // 기본 좌표값 (전역)
    const userInfo = useSelector((state) => {
        return state.userInfo
    })
    const navigate = useNavigate();   

    // 내부 상태
    const [isLogin, setIsLogin] = useState(false)

    useEffect(()=>{
        if(getCookie('token')?true:false){
            setIsLogin(true)
        }else{
            setIsLogin(false)
        }
    },[])

    // 방 생성하기
    const onClickRoomCreateHandler = () => {
        if(isLogin){
            console.log("#### userInfo", userInfo)
            const state = { 
                mySessionId : '',
                myUserName : '',
                isDirect : false,
                latitude : userInfo.userLatitude,
                longitude : userInfo.userLongitude,
                neighborhood : userInfo.userTown,
            };
            navigate('/room', { state : state });
        }else{
            alert('로그인 이후 사용 가능합니다.')
        }
    }

    return (
        <MainHeaderWrap>
            <MainTitleWrap>
                <div>모각코를 위한 서비스 플랫폼</div>
                <div>모각코 온에어</div>
            </MainTitleWrap>
            <MainDescWrap>
                <div>근처에 있는 사람들과 모여서 각자 코딩하고</div>
                <div>서로의 코드를 리뷰하며 성장하는 개발자가 되세요.</div>
            </MainDescWrap>
            <MainButtonWrap>
                <CreateRoomButton onClick={onClickRoomCreateHandler}>방 생성하기</CreateRoomButton>
            </MainButtonWrap>
        </MainHeaderWrap>
    );
}

export const MainHeaderWrap = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    display : flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`
export const MainTitleWrap = styled.div`
    display : flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color : white;
`
export const MainDescWrap = styled.div`
    display : flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color : white;
`
export const MainButtonWrap = styled.div`
    display : flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`
export const CreateRoomButton = styled.button`
    width : 100px;
`
export default MainHeader;