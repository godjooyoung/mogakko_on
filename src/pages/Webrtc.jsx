import React, { useEffect } from 'react'
import * as OpenVidu from 'openvidu-browser'
function Webrtc() {

  const [OV, setOV] = useState();
  const [session, setSession] = useState();
  const [initUserData, setInitUserData] = useState({
    mySessionId: channelId,
    myUserName: userInfo.nickname,
  });
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);

  const connectSession = () => {
    const newOV = new OpenVidu.OpenVidu();
    const newSession = OV.initSession();

    setOV(newOV);
    setSession(newSession);

    newSession.on("streamCreated", (event) => {
      //1. streamCreated이벤트는 새로운 스트림이 생성 되었을 때 발생한다.
      //2. streamCreated 이벤트의 경우, 새로 생성된 스트림에 대한 정보를 event 객체에서 확인
      let subscriber = newSession.subscribe(event.stream, undefined);
      //1. mysession RTC세션에서 subscriber을 생성하고 이벤트 스트림(event.stream)을 구독한다.
      //2. event.stream은 일반적으로 다른 참여자의 Publisher 객체에서 전달되는 오디오와 비드오 스트림을 나타낸다.
      //3. 구독하는 과정에서 추가적인 설정이 필요하지 않으므로 두 번째 인자로 undifined로 전달(두번째 인자는 콜백함수)
      //4. 생성된 Subscriber 객체는 RTC 세션에서 다른 참여자의 오디오와 비디오 스트림을 구독하기 위해 사용

      if (!subscriber.videos[0]) {
        let subscriberList = subscribers;
        subscriberList.push(subscriber);
        setSubscribers([...subscriberList]);
      }
    });

    // 나간 사람 삭제 안됨 에러 수정 해야 함
    newSession.on("streamDestroyed", (event) => {
      event.preventDefault();
    });

    // session 생성
    newSession.on("connectionCreated", (event) => { });
    // 1. connectionCreated 이벤트는 RTC 세션에 새로운 연결이 생성되었을 때 발생하는 이벤트
    // 2. connectionCreated 이벤트가 발생할 때마다 이벤트 핸들러의 콜백 함수가 실행

    // seisson 연결
    newSession
      // 1. RTC 세션 객체를 사용하여 토큰을 통해 연결을 설정
      .connect(token, { clientData: nickname })
      // { clientData: nickname }는 연결에 대한 클라이언트 데이터를 설정하는 옵션 객체 nickname 값은 리덕스로 관리하는듯함
      .then(async () => {
        let devices = await OV.getDevices();
        // OV.getDevices()를 사용하여 사용 가능한 디바이스 정보를 가져옴
        let videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
          // devices 배열에서 비디오 입력 장치만 필터링하여 videoDevices 배열에 할당.
          // videoDevices 배열에는 필터링된 비디오 입력 장치에 대한 정보가 포함
        );

        let publisher = OV.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: videoDevices[0].deviceId,
          // videoDevices[0]: videoDevices 배열의 첫 번째 요소
          // .deviceId: deviceId는 MediaDeviceInfo 객체의 속성으로, 해당 비디오 입력 장치의 고유 식별자
          // 미디어 스트림에서 사용할 특정 비디오 입력 장치를 선택할 수 있슴
          publishAudio: true,
          publishVideo: { width: 200, height: 300 },
          resolution: "200x300",
          frameRate: 30,
          insertMode: "APPEND",
          //퍼블리시한 미디어 스트림을 삽입할 위치를 지정
          mirror: true,
        });

        newSession.publish(publisher);
        // newSession.publish(publisher);는 newSession RTC 세션 객체를 사용하여,
        // publisher로 지정된 미디어 스트림을 퍼블리시하여 해당 세션에 참여한 다른 참여자들이 해당 미디어를 구독할 수 있게 함
        setMainStreamManager(publisher);
        // 퍼블리셔(publisher)를 메인 스트림 매니저로 설정함(방장이라 생각함) 이것을 useState로 관리함 
        // 근데 방만든사람만? 어케확인함?
      })
      .catch((err) => { });
  };

  // // 미디어 스트림 생성
  // const publisher = OV.initPublisher('publisher', {
  //   audioSource: undefined, // 기본 오디오 소스 사용
  //   videoSource: undefined, // 기본 비디오 소스 사용
  //   publishAudio: true, // 오디오 퍼블리싱 활성화
  //   publishVideo: true // 비디오 퍼블리싱 활성화
  // });
  // // 미디어 스트림을 특정 HTML 요소에 연결
  // publisher.addVideoElement('publisher');
  // // 테스트를 위해 미디어 스트림을 표시할 HTML 요소 추가
  // const publisherContainer = document.getElementById('publisher-container');
  // publisherContainer.appendChild(publisher.element);
  // // 컴포넌트 언마운트 시 미디어 스트림 정리
  // return () => {
  //   publisher.destroy();
  // };
}

return (
    <>
      <div>
        <div id="publisher-container">
          <div id="publisher"></div>
        </div>
      </div>
    </>
  )
}

export default Webrtc