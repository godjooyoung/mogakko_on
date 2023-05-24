// 현재 브라우저 위치 샘플 코드
import React, { useEffect, useState } from 'react';

function Test4(props) {
    // 현재 접속위치 가져오기

    const [latitude, setLatitude] = useState(null) // 위도
    const [longitude, setLongitude] = useState(null); // 경도

    useEffect(()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
            position => {
                console.log("???", position)
                setLatitude(position.coords.latitude)
                setLongitude(position.coords.longitude)
            },
            error => {
                console.log('위치정보를 가져올 수 없습니다.', error)
            })
        }else{
            console.log('Geoloaction이 지원되지 않는 브라우저 입니다.')
        }   
    }, [])

    return (
        <div>
            {latitude && longitude ? (<>현재위치는 : {latitude}, {longitude}</>) : <>위치정보를 가져오고 잇습니다.</>}
        </div>
    );
}

export default Test4;