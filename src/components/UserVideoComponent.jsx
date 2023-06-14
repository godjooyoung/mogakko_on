import React, { useEffect, useState } from 'react';
import OpenViduVideoComponent from './OpenViduVideo';
import { styled } from 'styled-components'
function UserVideoComponent({ streamManager }) {
    const [userAudio, setUserAudio] = useState(streamManager.stream.audioActive);
    console.log("streamManager>>>>>>>>>>>>>>>>>>>>>>>>", streamManager)
    // stream 속성의 connection.data 값을 파싱, 그 안에서 clientData 속성의 값을 반환 
    // 이 함수를 호출하면 현재 사용자의 닉네임을 가져옴.
    const getNicknameTag = () => {
        // Gets the nickName of the user
        const nickName = streamManager.stream.connection.data
        //const nickName = getCookie('nickName')
        return nickName
    }
    // const userAudio = streamManager.stream.audioActive
    // const userVideo = streamManager.stream.videoActive

    useEffect(() => {
        setUserAudio(streamManager.stream.audioActive);
    }, [streamManager.stream.audioActive]);

    return (
        <div>
            {streamManager !== undefined ? (
                <VideoComponentWrap className="streamcomponent">
                    <OpenViduVideoComponent streamManager={streamManager} />
                    <UserNickName>{getNicknameTag()} {!userAudio && <img src={`${process.env.PUBLIC_URL}/image/userMicOff.webp`} alt="마이크 음소거 아이콘" />}</UserNickName>
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
    font-size: 12px;
    position: absolute;
    left: 0;
    bottom: 4px;
    background: rgba(0, 0, 0, 0.59);
    border-bottom-left-radius: 10px;
    border-top-right-radius: 10px;
    padding-top: 5px;
    padding-bottom: 3px;
    padding-inline: 10px;
`
export default UserVideoComponent