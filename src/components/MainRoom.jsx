import React from 'react';
import { styled } from 'styled-components';

function MainRoom() {

    return (
        <RoomContainer>
            <button> 방 등록하기 </button>
            <div>
                방 카드 포문 돌리기 컴포넌트로 빼던지
            </div>
        </RoomContainer>
    );
}
export const RoomContainer = styled.div`
    width: 20vw;
    height: 100vh;
`
export default MainRoom;