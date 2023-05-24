import React, { useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { userLocationInfo } from '../../redux/modules/userLocation'
// 카카오 지도 api
const { kakao } = window;

function Test5(props) {
    // 1. 전역 상태 액션 함수 호출을 위한 디스패쳐 선언
    const dispatcher = useDispatch()
    // 2. 기본 설정 주소로 조회함.
    const userLocation = useSelector((state)=>{
        console.log("!!", state.userLocation)
        return state.userLocation
    })
    // 3. 리덕스 저장 디스페쳐
    //dispatcher(userLocationInfo(userLocation))

    // TODO sjy 서버 데이터로 변경 할 것 
    // 근방의 방 목록조회
    const roomList = [
        {   "id" : 1,
            "room_name": "같이 코딩해요",
            "is_opened": false,
            "room_people_num" : 8,
            "longitude_X" : 37.58180099090898,
            "latitude_Y" : 126.93536656513008,
            "elapsed_time" : "2:34:44"
        },
    ]

    const mapContainer = useRef(null)
    useEffect(()=>{
        const options = {
            center : new kakao.maps.LatLng(userLocation.longitude, userLocation.latitude),
            level : 4,
        }
        const map = new kakao.maps.Map(mapContainer.current, options)
        console.log("------" ,userLocation)
    },[])

    const onClickMapEvent = () => { 

    }

    return (
        <div>
            <KaKaoMap id='map' ref={mapContainer}></KaKaoMap>
        </div>
    );
}

export const KaKaoMap = styled.div`
    width: 100vw;
    height: 100vh;
`
export default Test5;