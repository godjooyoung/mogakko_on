import React, { useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { userLocationInfo } from '../../redux/modules/userLocation'
// 카카오 지도 api
const { kakao } = window;

function Test5(props) {
    // 0. 전역 상태 액션 함수 호출을 위한 디스패쳐 선언
    // const dispatcher = useDispatch()
    // 1. 전역 상태에 저장된 기본 설정 주소로 조회함.
    const searchLatLng = useSelector((state)=>{
        return state.userLocation
    })
    // 2. 로그인 && 유저 위치값 존재 일 경우
    const userLocation = useSelector((state)=>{
        return state.userLocation
    })

    // 2. 유저 위치값 가져오는 경우 dispatcher를 통해 변경
    // 3. 
    // 3. 리덕스 저장 디스페쳐
    //dispatcher(userLocationInfo(userLocation))

    // TODO sjy 서버 데이터로 변경 할 것 
    const roomList = [
        {   "id" : 1,
            "room_name": "같이 코딩해요",
            "is_opened": true,
            "room_people_num" : 8,
            "longitude_X" : 37.556516445779764,
            "latitude_Y" : 126.86748345152924,
            "elapsed_time" : "2:34:44"
        },
        {   "id" : 2,
            "room_name": "자스캠스모각모각",
            "is_opened": true,
            "room_people_num" : 6,
            "longitude_X" : 37.55484003481054,
            "latitude_Y" : 126.86698846167442,
            "elapsed_time" : "2:40:59"
        },
        {   "id" : 3,
        "room_name": "오늘의 우동왕",
        "is_opened": false,
        "room_people_num" : 4,
        "longitude_X" : 37.55471599685624,
        "latitude_Y" : 126.86886734023552,
        "elapsed_time" : "2:40:59"
        },
    ]

    const mapContainer = useRef(null)
    
    useEffect(()=>{
        const options = {
            center : new kakao.maps.LatLng(searchLatLng.longitude, searchLatLng.latitude),
            level : 4,
        }
        const map = new kakao.maps.Map(mapContainer.current, options)
        
        const bounds = new kakao.maps.LatLngBounds();
        // 배열을 돌며 마커 생성해서 붙인다.
        roomList.forEach((room)=>{
            const pointer = new kakao.maps.LatLng(room.longitude_X,  room.latitude_Y)
            bounds.extend(pointer)
            const marker = new kakao.maps.Marker({
                image : markerImage, // 마커의 이미지
                map: map, // 마커를 표시할 지도 객체
                position: new kakao.maps.LatLng(room.longitude_X, room.latitude_Y), // 마커의 좌표
                titile: room.room_name
            })

            const infowindow = new kakao.maps.InfoWindow({
                content: room.room_name // 인포윈도우에 표시할 내용
            });

            // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다 
            kakao.maps.event.addListener(marker, 'mouseover', function() {
                infowindow.open(map, marker);
            });

            // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
            kakao.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });

        })

        // 마커들이 모두 보이는 위치로 지도를 옮김
        map.setBounds(bounds);
        console.log("bounds 영역 좌표 상하좌우, 이걸 가지고 조회한다.",map.getBounds());
        console.log("현재 지도의 중심 좌표 center",map.getCenter());
    },[])

    // 마커 TODO sjy 나중에 커스텀 이미지로 바꾸기
    const markerImageUrl = 'https://t1.daumcdn.net/localimg/localimages/07/2012/img/marker_p.png', 
        markerImageSize = new kakao.maps.Size(40, 42), // 마커 이미지의 크기
        markerImageOptions = { 
        offset : new kakao.maps.Point(20, 42)// 마커 좌표에 일치시킬 이미지 안의 좌표
    };

    // 마커 이미지를 생성한다
    const markerImage = new kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions);

    // 마우스 오버

    return (
        <div>
            <KaKaoMap id='map' ref={mapContainer}></KaKaoMap>
        </div>
    )
}

export const KaKaoMap = styled.div`
    width: 100vw;
    height: 100vh;
`
export default Test5;