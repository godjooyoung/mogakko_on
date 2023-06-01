import React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { __userLocation, __userTown} from '../redux/modules/user'

function MainRoom() {

    // 기본 좌표값 (전역)
    const searchInfo = useSelector((state) => {
        console.log("searchInfo", state.searchInfo)
        return state.searchInfo
    })

    const userInfo = useSelector((state) => {
        return state.userInfo
    })

    const navigate = useNavigate();

    // 방참여하기
    const onClickJoinRoomHandler = (sessionId) => {
        alert(sessionId)
        const state = { 
            mySessionId : sessionId,
            myUserName : '신유저',
            isDirect : true,
            latitude : userInfo.userLatitude,
            longitude : userInfo.userLongitude,
            neighborhood : userInfo.userTown,
        };
        navigate('/room', {state : state });
    }

    // TODO sjy 서버 데이터로 변경 지금은 하드코딩임
    
    const roomList = [
        {
            "createdAt": "2023-05-30T21:53:14.647244",
            "modifiedAt": "2023-05-30T21:53:14.647244",
            "sessionId": "ses_SYQM0lRmEl",
            "title": "침묵의 모각코방 바로 화면 공유 ㄱ",
            "password": "1234",
            "language": "JAVA",
            "masterMemberId": 3,
            "maxMembers": 4,
            "cntMembers": 1,
            "roomDeleteTime": null,
            "lat": 37.60787909179756,
            "lon": 127.0873291901848,
            "neighborhood": "서울시 강서구 등촌동",
            "opened": false,
            "deleted": false,
        },
        {
            "createdAt": "2023-05-30T21:53:14.647244",
            "modifiedAt": "2023-05-30T21:53:14.647244",
            "sessionId": "ses_SYQM0lRmEl",
            "title": "멋진 모각코방",
            "password": "1234",
            "language": "JAVA",
            "masterMemberId": 3,
            "maxMembers": 4,
            "cntMembers": 1,
            "roomDeleteTime": null,
            "lat": 37.556516445779762,
            "lon": 126.86748345152914,
            "neighborhood": "서울시 강서구 염창동",
            "opened": false,
            "deleted": false,
        }
    ]
    return (
        <RoomContainer>
            <RoomList>
                {roomList.map((room, idx)=>{
                    return (
                        <RoomCard>
                            <div>{room.title}</div>
                            <div>{room.cntMembers}/{room.maxMembers}</div>
                            <div>{room.language}</div>
                            <div>
                                <button onClick={()=>{onClickJoinRoomHandler(room.sessionId)}}>참여하기 버튼</button>
                            </div>
                        </RoomCard>
                    )
                })}
            </RoomList>
            <RoomDetails>
                <div>방제목</div>
                <div>지역</div>
                <div>스터디시간</div>
                <div>정원</div>
                <div>언어</div>
                <div><button>버튼</button></div>
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
    /* justify-content: center; */
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
    background-color: aqua;
`
export default MainRoom;