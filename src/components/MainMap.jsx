import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserLocation } from '../redux/modules/user'
import { __searchLocation, __searchLanguage, __searchKeyword } from '../redux/modules/search';
import { getCookie } from '../cookie/Cookie';
// 카카오 지도 api
const { kakao } = window;

function MainMap(props) {

    // 내부
    const [isLogin, setIsLogin] = useState(false) // 로그인 여부

    // 전역
    const dispatcher = useDispatch()

    const searchInfo = useSelector((state) => {
        // 전역값 바뀌면 콘솔로그 찍어보기
        return state.searchInfo
    })

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
                // console.log("[INFO] 로그인을 하지 않은 사용자 입니다. 기본 조회위치로 지정합니다. (", isLogin, ")")
            } else {
                // console.log("[INFO] 로그인한 사용자 입니다.(", isLogin, ")")
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            // console.log("[INFO] 현재 접속된 위치로 조회위치를 변경합니다.")
                            dispatcher(fetchUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }))
                            dispatcher(__searchLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }))
                        },
                        error => {
                            // console.log("[INFO] 현재 접속된 위치를 받아올 수 없습니다. 기본 조회위치로 지정합니다.")
                            // console.log("[ERROR]", error)
                        })
                } else {
                    // console.log('[INFO] Geoloaction이 지원되지 않는 브라우저 입니다. 기본 조회위치로 지정합니다.')
                }
            }
        }
        settingDefaultSearch()
    }, [isLogin])


    const mapContainer = useRef(null)

    // 지도 설정
    useEffect(() => {
        if(props.roomList){
        // 사용자 접속위치로 지도 최초 세팅
        const options = {
            center: new kakao.maps.LatLng(searchInfo.searchLatitude, searchInfo.searchLongitude),
        }
        const map = new kakao.maps.Map(mapContainer.current, options)
        //map.setZoomable(false)
        const bounds = new kakao.maps.LatLngBounds();

        const getPinImg = (lang) => {
            let imageUrl
            switch (lang) {
                case "JAVA":
                    imageUrl = `${process.env.PUBLIC_URL}/image/defaultPinJava.webp`
                    break;
                case "JAVASCRIPT":
                    imageUrl = `${process.env.PUBLIC_URL}/image/defaultPinJs.webp`
                    break;
                case "PYTHON":
                    imageUrl = `${process.env.PUBLIC_URL}/image/defaultPinPy.webp`
                    break;
                case "C":
                    imageUrl = `${process.env.PUBLIC_URL}/image/defaultPinPy.webp`
                    break;
                case "C#":
                    imageUrl = `${process.env.PUBLIC_URL}/image/defaultPinCsharp.webp`
                    break;
                case "C++":
                    imageUrl = `${process.env.PUBLIC_URL}/image/defaultPinCpl.webp`
                    break;
                case "KOTLIN":
                    imageUrl = `${process.env.PUBLIC_URL}/image/defaultPinJs.webp`
                    break;
                default:
                    imageUrl = `${process.env.PUBLIC_URL}/image/defaultPinEtc.webp`
                    break;
            }
            const markerImageSize = new kakao.maps.Size(23, 35) // 마커 이미지의 크기
            const markerImageOptions = { offset: new kakao.maps.Point(12, 35) }
            const markerImage = new kakao.maps.MarkerImage(imageUrl, markerImageSize, markerImageOptions)
            return markerImage
        }

        const getPinBigImg = (lang) => {
            let imageUrl
            switch (lang) {
                case "JAVA":
                    imageUrl = `${process.env.PUBLIC_URL}/image/biggerPinJava.webp`
                    break;
                case "JAVASCRIPT":
                    imageUrl = `${process.env.PUBLIC_URL}/image/biggerPinJs.webp`
                    break;
                case "PYTHON":
                    imageUrl = `${process.env.PUBLIC_URL}/image/biggerPinPy.webp`
                    break;
                case "C":
                    imageUrl = `${process.env.PUBLIC_URL}/image/biggerPinPy.webp`
                    break;
                case "C#":
                    imageUrl = `${process.env.PUBLIC_URL}/image/biggerPinCsharp.webp`
                    break;
                case "C++":
                    imageUrl = `${process.env.PUBLIC_URL}/image/biggerPinCpl.webp`
                    break;
                case "KOTLIN":
                    imageUrl = `${process.env.PUBLIC_URL}/image/biggerPinnJs.webp`
                    break;
                default:
                    imageUrl = `${process.env.PUBLIC_URL}/image/biggerPinEtc.webp`
                    break;
            }
            const markerImageSize = new kakao.maps.Size(27.6, 42.6) // 마커 이미지의 크기
            const markerImageOptions = { offset: new kakao.maps.Point(13.5, 42.6) }
            const markerImage = new kakao.maps.MarkerImage(imageUrl, markerImageSize, markerImageOptions)
            return markerImage
        }


        // 검색 목록 배열을 돌며 마커 생성해서 붙인다.
        props.roomList && props.roomList.forEach((room) => {
            const pointer = new kakao.maps.LatLng(room.mogakkoRoom.lat, room.mogakkoRoom.lon)
            bounds.extend(pointer)

            const marker = new kakao.maps.Marker({
                image: getPinImg(room.mogakkoRoom.language), // 마커의 이미지
                map: map, // 마커를 표시할 지도 객체
                position: new kakao.maps.LatLng(room.mogakkoRoom.lat, room.mogakkoRoom.lon), // 마커의 좌표
                titile: room.mogakkoRoom.title
            })

            // 마커에 클릭 이벤트를 등록한다 (우클릭 : rightclick)
            kakao.maps.event.addListener(marker, 'click', function () {
                // console.log('마커를 클릭했습니다!');
            });

            // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 
            kakao.maps.event.addListener(marker, 'mouseover', function () {
                // console.log('마커에 mouseover 이벤트가 발생했습니다!');
                marker.setImage(getPinBigImg(room.mogakkoRoom.language));
            });

            // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 
            kakao.maps.event.addListener(marker, 'mouseout', function () {
                // console.log('마커에 mouseover 이벤트가 발생했습니다!');
                marker.setImage(getPinImg(room.mogakkoRoom.language));
            });

        })

        //마커들이 모두 보이는 위치로 지도를 옮김
        //map.setBounds(bounds);

        // 드래그가 발생할 경우 지도의 중심 좌표를 다시 얻어와서 조회한다.
        kakao.maps.event.addListener(map, 'dragend', function () {
            // const latlng = map.getCenter(); 
            // 지도의 중심좌표를 얻어옵니다 
            const getCenterLatLng = async () => {
                const latlng = await map.getCenter();
                setMapCenterDragend(latlng)
            }

            // 변경된 중심좌표를 전역상태로 반영
            const setMapCenterDragend = (latlng) => {
                // console.log("[INFO] getMapCenterDragend ", latlng.getLat(), latlng.getLng())
                dispatcher(fetchUserLocation({ latitude: latlng.getLat(), longitude: latlng.getLng() }))
                dispatcher(__searchLocation({ latitude: latlng.getLat(), longitude: latlng.getLng() }))
            }

            getCenterLatLng()
        });

        }
    }, [searchInfo])

    return (
        <MapContainer>
            <KaKaoMap id='map' ref={mapContainer}></KaKaoMap>
        </MapContainer>
    )
}

export const MapContainer = styled.div`
    width: 486px;
    height: 412px;
    border-radius: 20px;
`

export const KaKaoMap = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 20px;

`

export default MainMap