import React, { useRef, useEffect } from 'react';
function Test(props) {
    /*  화면 공유를 위한 변수 선언 */

    // 비디오를 표시할 곳 지정
    const localViedoRef = useRef()
    const remoteViedoRef = useRef()

    // 브라우저 끼리 브라우저 연결
    const pearConnect = useRef()
    // 1. 사용자 비디오 값 가져오기
    const getUserMedia = async () => {
        const opt = {
            audio: false,
            video: true,
        }
        // async/ await 없을때
        // navigator.mediaDevices.getUserMedia(opt)
        // .then(stream => {
        //     // 제약으로 걸어둔 opt를 통과하면 미디어 스트림을 디스플레이해준다.
        //     localViedoRef.current.srcObject = stream
        // })
        // .catch( e=> {
        //     console.log("에러")
        // })
        const stream = await navigator.mediaDevices.getUserMedia(opt)
        localViedoRef.current.srcObject = stream


        const pc = new RTCPeerConnection(null)
        // 아이스가 연결됨
        pc.onicecandidate = (e) => {
            if (e.condidate) {
                console.log(JSON.stringify(e.condidate))
            }
        }
        // 아이스가 상태 체크
        pc.oniceconnectionstatechange = (e) => {
            console.log(e) // connect, disconnect, fail ,close
        }

        // 리모트 미디어 스트림을 여기에서 트랙으로 가져옴
        pc.ontrack = (e) => {

        }

        pearConnect.current = pc
    }

    // 2. 랜더링 되면 자동으로 내 화면 공유하기
    useEffect(() => {
        getUserMedia()
    }, [])


    return (
        <>
            <div>
                <button onClick={() => { getUserMedia() }}>오퍼보낼 준비</button>
                <button onClick={() => { getUserMedia() }}>응답받을 준비</button>
                <button onClick={() => { getUserMedia() }}>원격 연결 설정</button>
                <button onClick={() => { getUserMedia() }}>원격 추가 붙이기</button>
            </div>
            <div>
                <video ref={localViedoRef} autoPlay></video>
                <video ref={remoteViedoRef} autoPlay></video>
            </div>
        </>
    );
}

export default Test;