import React, { useRef, useEffect } from 'react'

function OpenViduVideoComponent({ streamManager }) {
    const videoRef = useRef()

    useEffect(() => {
        //streamManager와 videoRef.current가 존재하는 경우
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current)
        }
    }, [streamManager])

    return <video autoPlay={true} ref={videoRef} width={'1200px'} style={{
        borderRadius: '10px',
        objectFit: 'cover'
    }}/>
}

// 스트림 관리자(streamManager)가 변경될 때마다 비디오 요소를 추가

// 스트림 관리자 객체(streamManager)가 초기화되고, (초기화란 해당 객체를 생성하고 설정하는 과정)
// videoRef.current가 유효한 DOM 요소를 참조하는 경우에만 
// 해당 DOM 요소를 스트림 관리자에 추가하는 동작을 수행합니다. 
// 이를 통해 스트림에서 수신된 비디오를 해당 DOM 요소에 표시할 수 있게 됩니다.

export default OpenViduVideoComponent