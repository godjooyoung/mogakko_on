import React, { useEffect, useState } from 'react';
import OpenViduVideoComponent from './OpenViduVideo';
import { styled } from 'styled-components'
function UserVideoComponent(props) {
    const [userAudio, setUserAudio] = useState(props.streamManager.stream.audioActive);
    console.log("userViedoCompnent >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>1", props.streamManager)
    console.log("userViedoCompnent >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>2", props.streamManager.stream.connection)
    // stream 속성의 connection.data 값을 파싱, 그 안에서 clientData 속성의 값을 반환 
    // 이 함수를 호출하면 현재 사용자의 닉네임을 가져옴.
    const getNicknameTag = () => {
        
        const nickName = props.streamManager.stream.connection.data
        return nickName
    }

    useEffect(() => {
        setUserAudio(props.streamManager.stream.audioActive);
    }, [props.streamManager.stream.audioActive]);

    return (
        <div>
            {props.streamManager !== undefined ? (
                <VideoComponentWrap className="streamcomponent">
                    <OpenViduVideoComponent streamManager={props.streamManager} />
                    <UserNickName>
                        {getNicknameTag()} {!userAudio && <img src={`${process.env.PUBLIC_URL}/image/userMicOff.webp`} alt="마이크 음소거 아이콘" />}
                    </UserNickName>
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