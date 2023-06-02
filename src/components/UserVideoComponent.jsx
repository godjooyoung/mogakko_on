import React from 'react';
import OpenViduVideoComponent from './OpenViduVideo';
import { getCookie } from '../cookie/Cookie';

function UserVideoComponent({ streamManager }) {

    // stream 속성의 connection.data 값을 파싱, 그 안에서 clientData 속성의 값을 반환 
    // 이 함수를 호출하면 현재 사용자의 닉네임을 가져옴.
    const getNicknameTag = async() => {
        // Gets the nickName of the user
        const nickName = await getCookie('nickName')
        return nickName
    }

    return (
        <div>
            {streamManager !== undefined ? (
                <div className="streamcomponent">
                    <OpenViduVideoComponent streamManager={streamManager} />
                    <div><p>{getNicknameTag()}</p></div>
                </div>
            ) : null}
        </div>
    );
}

export default UserVideoComponent