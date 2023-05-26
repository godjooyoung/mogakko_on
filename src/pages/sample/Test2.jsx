// TODO sjy webRTC 테스트 하던 코드 삭제할 것.
import React, { useRef, useEffect } from 'react';

function Test2(props) {
    // 비디오를 표시할 곳 지정
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const textRef = useRef();

    // pear 연결을 위한 커넥션 생성. 만약 pear가 n개 만큼 늘면 이거도 n개만큼 늘어야함.
    const pearConnect = useRef(new RTCPeerConnection(null));

    // 1. 랜더링 되면 자동으로 내 화면 공유하기
    useEffect(() => {
        const opt = {
            audio: false,
            video: true,
        };
        navigator.mediaDevices.getUserMedia(opt)
            .then((stream) => {
                localVideoRef.current.srcObject = stream;
                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream);
                });
            })
            .catch((error) => {
                console.log('ERROR', error);
            });

        // 리모트 pear 연결을 위한 커넥션 생성. 만약 pear가 n개 만큼 늘면 이거도 n개만큼 늘어야함.
        const pc = new RTCPeerConnection(null);
        // 아이스가 연결됨
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                console.log(JSON.stringify(e.candidate));
            }
        };
        // 아이스 상태 체크
        pc.oniceconnectionstatechange = (e) => {
            console.log(e); // connect, disconnect, fail, close
        };

        // 리모트 미디어 스트림을 여기에서 트랙으로 가져옴
        pc.ontrack = (e) => {
            remoteVideoRef.current.srcObject = e.streams[0];
        };

        pearConnect.current = pc;
    }, []);

    // 3. 요청보내기
    const createOffer = () => {
        pearConnect.current.createOffer({
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
        }).then(sdp => {
            // 요청 성공
            console.log("다른 포인트와 커넷팅 준비 완. 우리는 오퍼 보내요. 우리랑 연결되는 분!! sdp 보고 와주쇼");
            console.log(JSON.stringify(sdp));
            pearConnect.current.setLocalDescription(sdp);
        }).catch((e) => {
            // 요청 실패
        });
    };

    // 4. 원격 피어에 보낸 요청에 원격 피어에서 아 ㅇㅋㅇㅋ 우리도 제안서 보냄 이러면서 sdp 보내면 그 sdp 받기
    const createAnswer = () => {
        pearConnect.current.createAnswer({
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
        }).then(sdp => {
            // 응답 성공
            console.log("다른 포인트와 커넷팅 준비 완");
            console.log(JSON.stringify(sdp));
            pearConnect.current.setLocalDescription(sdp);
        }).catch((e) => {
            // 응답 실패
        });
    };

    const setRemoteDescription = () => {
        // get Sdp를 해서 텍스트 에리어에 부려줄거임
        // textaraa의 응답 제안 sdp를 가져와서 응답 sdp로 선언할꺼임.
        const sdp = JSON.parse(textRef.current.value);
        console.log(sdp);
        // 그리고 이 sdp로 현재 피어에서 원격 피어를 연결 할꺼임
        pearConnect.current.setRemoteDescription(new RTCSessionDescription({sdp}));
    };

    const addCandidate = () => {
        const candidate = JSON.parse(textRef.current.value);
        console.log('add 캔디에이트', candidate);
        if (pearConnect.current.remoteDescription) {
            pearConnect.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
            console.log('원격 설명이 아직 설정되지 않았습니다.');
        }
    };

    return (
        <>
            <div>
                <button onClick={createOffer}>pearA : 오퍼보낼 준비</button>
                <button onClick={createAnswer}>pear B -2 : 앤서 만듦</button>
                <button onClick={setRemoteDescription}> pearB - 1: 원격 연결을 위한 Remote desc 설정, pear A - 2 </button>
                <button onClick={addCandidate}>원격 추가 붙이기</button>
                <textarea ref={textRef}></textarea>
            </div>
            <div>
                <video ref={localVideoRef} autoPlay></video>
                <video ref={remoteVideoRef} autoPlay></video>
            </div>
        </>
    );
}

export default Test2;