import React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

function MainRoom() {
    const navigate = useNavigate();

    // 방생성하기
    const onClickRoomCreateHandler = () => {
        const state = { 
            mySessionId : '',
            myUserName : '',
            isDirect : false,
        };
        navigate('/room', {state : state });
    }
    // 방참여하기
    const onClickJoinRoomHandler = (sessionId) => {
        alert(sessionId)
        const state = { 
            mySessionId : sessionId,
            myUserName : '신유저',
            isDirect : true,
        };
        navigate('/room', {state : state });
    }

    // TODO sjy 서버 데이터로 변경 지금은 하드코딩임
    const roomList = [
        {   
            "id" : 1,
            "room_name": "같이 코딩해요",
            "is_opened": true,
            "room_people_num" : 8,
            "longitude_X" : 37.556516445779762,
            "latitude_Y" : 126.86748345152914,
            "elapsed_time" : "2:34:44",
            "room_session_id" : 'session123'
        },
        {   
            "id" : 2,
            "room_name": "자스캠스모각모각",
            "is_opened": true,
            "room_people_num" : 6,
            "longitude_X" : 37.55484003481054,
            "latitude_Y" : 126.86698846167442,
            "elapsed_time" : "2:40:59",
            "room_session_id" : 'session1234'
        },
        {   
            "id" : 3,
            "room_name": "오늘의 우동왕",
            "is_opened": false,
            "room_people_num" : 4,
            "longitude_X" : 37.55471599685624,
            "latitude_Y" : 126.86886734023552,
            "elapsed_time" : "2:40:59",
            "room_session_id" : 's4'
        },
    ]
    return (
        <RoomContainer>
            <button onClick={onClickRoomCreateHandler}> 방 등록하기 </button>
            <RoomList>
                {roomList.map((room, idx)=>{
                    return (
                        <RoomCard>
                            <div>{room.room_name}</div>
                            <div>1/{room.room_people_num}</div>
                            <div>방언어 자바스크립트</div>
                            <div>
                                <button>둘러보기</button>
                                <button onClick={()=>{onClickJoinRoomHandler(room.room_session_id)}}>참여하기 버튼</button>
                            </div>
                        </RoomCard>
                    )
                })}
            </RoomList>
        </RoomContainer>
    );
}
export const RoomContainer = styled.div`
    width: 20vw;
    height: 100vh;
`
export const RoomList = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    gap: 5px;
`
export const RoomCard = styled.div`
    width: 80%;
    height: 100px;
    background-color: aqua;
`
export default MainRoom;