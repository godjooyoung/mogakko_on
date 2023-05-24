import React, { useRef, useEffect } from 'react';

function Test2(props) {
    // 비디오를 표시할 곳 지정
    const localViedoRef = useRef()
    const remoteViedoRef = useRef()

    // 브라우저 끼리 브라우저 연결
    const pearConnect = useRef(new RTCPeerConnection(null))

    // 1. 사용자 비디오 값 가져오기
    const getUserMedia = async () => {
        const opt = {
            audio: false,
            video: true,
        }
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

    // 3. 요청보내기
    const createOffer = () =>{
        pearConnect.createOffer({
        }).then( sdp => {
            // 요청 성공
            console.log("다른 포인트와 커넷팅 준비 완")
            pearConnect.current.setLocalDescription(sdp)
        }).cathc((e)=>{
            // 요청 실패
        })
    }
    // 4. 받기
    const createAnswer = () =>{
        pearConnect.createAnswer({
        }).then( sdp => {
            // 요청 성공
            console.log("다른 포인트와 커넷팅 준비 완")
            pearConnect.current.setLocalDescription(sdp)
        }).cathc((e)=>{
            // 요청 실패
        })
    }

    
    return (
        <>
            <div>
                <button onClick={() => { createOffer() }}>오퍼보낼 준비</button>
                <button onClick={() => { createAnswer() }}>응답받을 준비</button>
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

export default Test2;