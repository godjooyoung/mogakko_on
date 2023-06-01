import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserLocation } from '../redux/modules/user'
import { __searchLocation, __searchLanguage, __searchKeyword } from '../redux/modules/search';
import { getCookie, removeCookie } from '../cookie/Cookie';
// 카카오 지도 api
const { kakao } = window;

function MainMap() {

    // 내부
    const [timer, setTimer] = useState(0); // 디바운싱 타이머
    const [isLogin, setIsLogin] = useState(false) // 로그인 여부

    // 전역
    const dispatcher = useDispatch()
    const userInfo = useSelector((state) => {
        console.log("userInfo", state.userInfo)
        return state.userInfo
    })
    const searchInfo = useSelector((state) => {
        console.log("searchInfo", state.searchInfo)
        return state.searchInfo
    })


    // TODO  sjy props로 내려주는 서버 데이터로 변경 할 것 
    const roomList = [
        {   
            "id" : 1,
            "room_name": "같이 코딩해요",
            "is_opened": true,
            "room_people_num" : 8,
            "lat" : 37.556516445779762,
            "lon" : 126.86748345152914,
            "elapsed_time" : "2:34:44"
        },
        {   
            "id" : 2,
            "room_name": "자스캠스모각모각",
            "is_opened": true,
            "room_people_num" : 6,
            "lat" : 37.55484003481054,
            "lon" : 126.86698846167442,
            "elapsed_time" : "2:40:59"
        },
        {   
            "id" : 3,
            "room_name": "오늘의 우동왕",
            "is_opened": false,
            "room_people_num" : 4,
            "lat" : 37.55471599685624,
            "lon" : 126.86886734023552,
            "elapsed_time" : "2:40:59"
        },
    ]

    // 로그인 여부에 따라서 사용자 접속 위치 및 동네이름 가져오기.
    useEffect(() => {
        // 로그인 여부
        const checkLoginStatus = async () => {
            const token = await getCookie("token");
            setIsLogin(token ? true : false);
        };
        checkLoginStatus()

        const settingDefaultSearch = () => {
            if (!isLogin) {
                console.log("[INFO] 로그인을 하지 않은 사용자 입니다. 기본 조회위치로 지정합니다. (", isLogin, ")")
            } else {
                console.log("[INFO] 로그인한 사용자 입니다.(", isLogin, ")")
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            console.log("[INFO] 현재 접속된 위치로 조회위치를 변경합니다.")
                            dispatcher(fetchUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude  }))
                            dispatcher(__searchLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude  }))
                        },
                        error => {
                            console.log("[INFO] 현재 접속된 위치를 받아올 수 없습니다. 기본 조회위치로 지정합니다.")
                            console.log("[ERROR]", error)
                        })
                } else {
                    console.log('[INFO] Geoloaction이 지원되지 않는 브라우저 입니다. 기본 조회위치로 지정합니다.')
                }
            }
        }
        settingDefaultSearch()
    }, [isLogin])

    const mapContainer = useRef(null)
    
    // 지도 설정
    useEffect(()=>{
        // 사용자 접속위치로 지도 최초 세팅
        const options = {
            center : new kakao.maps.LatLng(searchInfo.searchLatitude, searchInfo.searchLongitude),
            level : 4,
        }

        const map = new kakao.maps.Map(mapContainer.current, options)
        const bounds = new kakao.maps.LatLngBounds();
        
        // 검색 목록 배열을 돌며 마커 생성해서 붙인다.
        roomList.forEach((room)=>{
            const pointer = new kakao.maps.LatLng(room.lat, room.lon)
            bounds.extend(pointer)
            const marker = new kakao.maps.Marker({
                image : markerImage, // 마커의 이미지
                map: map, // 마커를 표시할 지도 객체
                position: new kakao.maps.LatLng(room.lat, room.lon), // 마커의 좌표
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
        // map.setBounds(bounds);

        kakao.maps.event.addListener(map, 'center_changed', function() {
            console.log("현재 지도의 중심좌표 요청 이벤트")
            // 디바운싱 - 마지막 호출만 적용 
            if (timer) {
                console.log('clear timer');
                clearTimeout(timer);
            }
            const newTimer = setTimeout(async () => {
                try {
                    await getMapCenterDebouncing()
                } catch (e) {
                    console.error('error', e);
                }
            }, 2000);
                setTimer(newTimer);

            // 지도의 중심좌표를 얻어옵니다 
            const getMapCenterDebouncing = () => {
                dispatcher(fetchUserLocation({ latitude: map.getCenter().getLat(), longitude: map.getCenter().getLng()}))
                dispatcher(__searchLocation({ latitude: map.getCenter().getLat(), longitude: map.getCenter().getLng() }))
            }
        });

    },[searchInfo.searchLatitude])

    
    // 마커 TODO sjy 나중에 커스텀 이미지로 바꾸기
    const markerImageUrl = 'https://t1.daumcdn.net/localimg/localimages/07/2012/img/marker_p.png', 
        markerImageSize = new kakao.maps.Size(40, 42), // 마커 이미지의 크기
        markerImageOptions = { 
        offset : new kakao.maps.Point(20, 42)// 마커 좌표에 일치시킬 이미지 안의 좌표
    };

    // 마커 이미지를 생성한다
    const markerImage = new kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions);
    return (
        <MapContainer>
            <KaKaoMap id='map' ref={mapContainer}></KaKaoMap>
        </MapContainer>
    )
}

export const MapContainer = styled.div`
    width: 100%;
    height: 100%;
`

export const KaKaoMap = styled.div`
    width: 100%;
    height: 100%;

`

export default MainMap;