import React from 'react';
import OpenViduVideoComponent from './OpenViduVideo';
import { getCookie } from '../cookie/Cookie';
import { styled } from 'styled-components'
function UserVideoComponent({ streamManager }) {

    // stream 속성의 connection.data 값을 파싱, 그 안에서 clientData 속성의 값을 반환 
    // 이 함수를 호출하면 현재 사용자의 닉네임을 가져옴.
    const getNicknameTag = () => {
        // Gets the nickName of the user
        const nickName = getCookie('nickName')
        return nickName
    }

    return (
        <div>
            {streamManager !== undefined ? (
                <VideoComponentWrap className="streamcomponent">
                    <OpenViduVideoComponent streamManager={streamManager} />
                    <UserNickName>{getNicknameTag()}</UserNickName>
                </VideoComponentWrap>
            ) : null}
        </div>
    );
}

export const VideoComponentWrap = styled.div`
    position: relative;
`

export const UserNickName = styled.span`
    color: white;
    font-size: 14px;
    position: absolute;
    left: 15px;
    bottom: 15px;
`
export default UserVideoComponent