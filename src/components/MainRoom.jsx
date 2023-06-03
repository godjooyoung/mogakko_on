import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { __userLocation, __userTown} from '../redux/modules/user'
import { getCookie } from '../cookie/Cookie';

function MainRoom(props) {

    // 기본 좌표값 (전역)
    const searchInfo = useSelector((state) => {
        //console.log("searchInfo", state.searchInfo)
        return state.searchInfo
    })

    const userInfo = useSelector((state) => {
        return state.userInfo
    })

    const navigate = useNavigate()

    // 내부 상태
    const [roomDetails, setRoomDetails] = useState(props.roomList[0])

    // 방참여하기
    const onClickJoinRoomHandler = (details) => {
        console.log(">>>>>>>>>>>>>>>>> details", details)
        const state = { 
            mySessionId : details.sessionId,
            myUserName : getCookie('nickName'),
            isDirect : true,
            title : details.title,
            language : details.language,
            maxMembers : details.maxMembers,
            isOpened : details.opened,
            password : details.password,
            latitude : details.lat,
            longitude : details.lon,
            neighborhood : details.neighborhood,
        };
        navigate('/room', {state : state })
    }

    // 방 상세보기
    const onClickRoomDetailsHandler = (details) => {
        setRoomDetails(details)
    }

    return (
        <RoomContainer>
            <RoomList>
                {props.roomList&&props.roomList.map((room, idx)=>{
                    return (
                        <RoomCard onClick={()=>{onClickRoomDetailsHandler(room)}}> 
                            <div>{room.title}</div>
                            <div>지역 : {room.neighborhood}</div>
                            <div>모각코시간 : {room.createdAt}</div>
                            <div>{room.cntMembers}/{room.maxMembers}</div>
                            <div>{room.language}</div>
                        </RoomCard>
                    )
                })}
            </RoomList>
            <RoomDetails>
                <div>{roomDetails&&roomDetails.title}</div>
                <div>지역 : {roomDetails&&roomDetails.neighborhood}</div>
                <div>모각코시간 : {roomDetails&&roomDetails.createdAt}</div>
                <div>정원 : {roomDetails&&roomDetails.cntMembers}/{roomDetails&&roomDetails.maxMembers}</div>
                <div>언어 : {roomDetails&&roomDetails.language}</div>
                <div>
                    <button onClick={()=>{onClickJoinRoomHandler(roomDetails)}}>참여하기</button>
                </div>
            </RoomDetails>
        </RoomContainer>
    );
}
export const RoomContainer = styled.div`
    display: flex;
    grid-column-start: 1;
    grid-column-end: 3;
    width: 100%;
    height: 100%;
    background-color: blueviolet;
`
export const RoomList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    gap: 5px;
    overflow-y: scroll;
`
export const RoomDetails = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 50%;
    height: 100%;
    background-color: darkgoldenrod;
`
export const RoomCard = styled.div`
    min-height: 100px;
    width: 100%;
    height: 100px;
    background-color: skyblue;
    cursor: pointer;
`
export default MainRoom