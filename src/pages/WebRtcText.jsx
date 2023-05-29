import React from 'react'
import { OpenVidu } from 'openvidu-browser';
import React, { useEffect, useRef } from 'react';
function WebRtcText() {
  const OV = new OpenVidu();
  const session = OV.initSession();

  const publisher = OV.initPublisher(undefined, {
    audioSource: undefined, // 오디오 소스 (기본값: 마이크)
    videoSource: undefined, // 비디오 소스 (기본값: 웹캠)
    publishAudio: true, // 오디오 전송 여부
    publishVideo: true, // 비디오 전송 여부
    resolution: '640x480', // 비디오 해상도
    frameRate: 30, // 비디오 프레임 속도
    insertMode: 'APPEND', // 비디오 삽입 모드
    mirror: false, // 비디오 미러 모드 여부
  });

  session.publish(publisher);


  const PublisherComponent = ({ publisher }) => {
    const videoRef = useRef();
    useEffect(() => {
      if (publisher && videoRef.current) {
        videoRef.current.srcObject = publisher.streamManager.stream;
      }
    }, [publisher]);

    return (
      <>
        <video ref={videoRef} autoPlay muted />
      </>
    )
  }

  export default WebRtcText