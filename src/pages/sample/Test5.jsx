// // // 리덕스 툴킷 사용 예시 입니다. (sjy)
// // import React from 'react';

// // import { useDispatch, useSelector } from 'react-redux';
// // import { postIsEditMode, pwConfirmIsActive, registerIsActive } from '../../redux/modules/componentMode';

// // function Example(props) {

// //     // 1. 전역 상태 액션 함수 호출을 위한 디스패쳐 선언
// //     const dispatcher = useDispatch()

// //     // 2. 전역 상태 변경
// //     const onClickExampleHandler = () => {
// //         dispatcher(registerIsActive(true))
// //         dispatcher(pwConfirmIsActive(true))
// //         dispatcher(postIsEditMode(true))
// //     }

// //     // 3. 전역 상태 호출을 위한 useSelector 선언
// //     const isActive = useSelector((state)=>{
// //         return state.componentMode.registerIsActive
// //     })

// //     return (
// //         <div>
// //             <div>샘플 0 - 리덕스 툴킷 전역 상태 예시 페이지 입니다.</div>
// //             <div>현재 전역상태는 {isActive?<>참입니다</>:<>거짓입니다.</>}</div>
// //             <button onClick={onClickExampleHandler} type="button" class="text-white bg-blue-700 text-sm px-5 py-2.5 mr-2 mb-2 rounded-lg" > 전역 상태 값 변경 예시 버튼</button>
// //         </div>
// //     );
// // }

// // export default Example;

// // 카카오 지도 api
// import React, { useEffect, useRef } from 'react';
// import { styled } from 'styled-components';
// // 카카오 지도 api
// const { kakao } = window;
// // 리덕스 전역
// import { useDispatch, useSelector } from 'react-redux';
// import { postIsEditMode, pwConfirmIsActive, registerIsActive } from '../../redux/modules/componentMode';

// function Test5(props) {
//     // TODO 내 위치를 기반으로 최초 조회
//     // TODO 내 현재 위치 전역에서 가져오기
//     // const userLocation = 
//     // {"":37.5561332,
//     //  "":, }
//     // TODO sjy 서버 데이터로 변경 할 것 
//     // 근방의 방 목록조회
//     const roomList = [
//         {
//             "id" : 1,
//             "room_name": "같이 코딩해요",
//             "is_opened": false,
//             "room_people_num" : 8,
//             "longitude_X" : 37.58180099090898,
//             "latitude_Y" : 126.93536656513008,
//             "elapsed_time" : "2:34:44"
//         },

//     ]

//     const mapContainer = useRef(null)
//     useEffect(()=>{
//         const options = {
//             center : new kakao.maps.LatLng(37.5561332, 126.8656449),
//             level : 4,
//         }
//         const map = new kakao.maps.Map(mapContainer.current, options)
//     },[])

//     const onClickMapEvent = () => { 

//     }

//     return (
//         <div>
//             <KaKaoMap id='map' ref={mapContainer}></KaKaoMap>
//         </div>
//     );
// }

// export const KaKaoMap = styled.div`
//     width: 100vw;
//     height: 100vh;
// `
// export default Test5;