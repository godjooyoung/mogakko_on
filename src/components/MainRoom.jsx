import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { __userLocation, __userTown } from '../redux/modules/user'
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
        const state = {
            mySessionId: details.sessionId,
            myUserName: getCookie('nickName'),
            isDirect: true,
            title: details.title,
            language: details.language,
            maxMembers: details.maxMembers,
            isOpened: details.opened,
            password: details.password,
            latitude: details.lat,
            longitude: details.lon,
            neighborhood: details.neighborhood,
        };
        navigate('/room', { state: state })
    }

    // 방 상세보기
    const onClickRoomDetailsHandler = (details) => {
        setRoomDetails(details)
    }

    return (
        <RoomContainer>
            {props.roomList.length === 0 ?
                <>
                    <EmptyRoom>
                        <div>
                            <EmptyImgDiv>
                                <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M39.7721 74.4331C58.918 74.4331 74.4388 58.9123 74.4388 39.7664C74.4388 20.6205 58.918 5.09973 39.7721 5.09973C20.6263 5.09973 5.10547 20.6205 5.10547 39.7664C5.10547 58.9123 20.6263 74.4331 39.7721 74.4331Z" stroke="#BEBEBE" stroke-width="8.66667" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M90.9073 90.8997L66.6406 66.6331" stroke="#BEBEBE" stroke-width="8.66667" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </EmptyImgDiv>
                            <EmptyDescDiv>
                                <EmptyDesc>주변에 개설된 모각코가 없습니다.</EmptyDesc>
                                <EmptyDesc>다른 지역을 검색하거나 모각코 방을 개설해 주세요.</EmptyDesc>
                            </EmptyDescDiv>
                        </div>
                    </EmptyRoom>
                </> :
                <>
                    <RoomList>
                        {props.roomList && props.roomList.map((room, idx) => {
                            return (
                                <RoomCard onClick={() => { onClickRoomDetailsHandler(room) }}>
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
                        <div>{roomDetails && roomDetails.title}</div>
                        <div>지역 : {roomDetails && roomDetails.neighborhood}</div>
                        <div>모각코시간 : {roomDetails && roomDetails.createdAt}</div>
                        <div>정원 : {roomDetails && roomDetails.cntMembers}/{roomDetails && roomDetails.maxMembers}</div>
                        <div>언어 : {roomDetails && roomDetails.language}</div>
                        <div>
                            <button onClick={() => { onClickJoinRoomHandler(roomDetails) }}>참여하기</button>
                        </div>
                    </RoomDetails>
                </>

            }


        </RoomContainer>
    );
}
export const RoomContainer = styled.div`
    display: flex;
    grid-column-start: 1;
    grid-column-end: 3;
    width: 100%;
    height: 100%;
    background-color: transparent;
    justify-content: center;
`
export const EmptyRoom = styled.div`
    width: 996px;
    height: 440px;
    background: #394254;
    border-radius: 20px;
    position: absolute;
`
export const EmptyImgDiv = styled.div`
    width: 104px;
    height: 104px;
    position: absolute;
    left: calc(50% - 104px/2);
    top: 118px;
`
export const EmptyDescDiv = styled.div`
    position: absolute;
    width: 510px;
    height: 110px;
    left: 243px;
    top: 248px;
`
export const EmptyDesc = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 165.02%;
    text-align: center;
    color: #BEBEBE;
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