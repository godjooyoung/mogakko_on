import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie, removeCookie } from '../cookie/Cookie';
import { styled } from 'styled-components';
import { useQuery, useQueryClient } from 'react-query';
import { getLatLng } from '../axios/api/kakao'

import MainMap from '../components/MainMap';
function Main(props) {

    const formData = new FormData();
    
    // 로그인 여부
    const [isLogin, setIsLogin] = useState(false)
    // 기본 좌표값
    const defaultLatLng = useSelector((state) => {
        console.log("defaultLatLng", state.userLocation)
        return state.userLocation
    })
    // 검색 좌표값
    const [searchLatLng, setSearchLatLng] = useState(defaultLatLng)


    // 리액트 쿼리
    const queryClient = useQueryClient();
    // 주소 -> 좌표값
    const [targetAddress, setTargetAddress] = useState(null)
    const [isTargeting, setIsTargeting] = useState(false)
    const getLatLngQuery = useQuery(['getLatLng', getLatLng], () => getLatLng(targetAddress), {
        enabled: isTargeting
    })


    // TODO sjy 서버데이터 사용할 것 지금은 하드 코딩임
    const [townList, setTownList] = useState(
        {
            hotTown: [
                { townTitle: '서울 강서구 염창동' },
                { townTitle: '서울 강서구 가양동' },
                { townTitle: '서울 영등포구 문래동' },
                { townTitle: '서울 관악구 신림동' }

            ],
        }
    )

    const onClickGetLatLngHandler = (adress) => {
        setIsTargeting(true)
        setTargetAddress(adress)
    }

    useEffect(() => {
        // 로그인 여부
        const checkLoginStatus = async () => {
            // 토큰 유무를 통해 로그인 여부를 파악한다.
            const token = await getCookie("token");
            setIsLogin(token ? true : false);
        };
        checkLoginStatus()

        // 로그인 여부에 따른 기본 검색값 설정
        const settingDefaultSearch = () => {
            if (!isLogin) {
                console.log("isLogin : ", isLogin)
                setSearchLatLng({ ...defaultLatLng })
            } else {
                console.log("isLogin : ", isLogin)
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            setSearchLatLng({
                                ...searchLatLng, ...{
                                    longitude: position.coords.longitude,
                                    latitude: position.coords.latitude
                                }
                            })
                        },
                        error => {
                            console.log("[ERROR]", error)
                            setSearchLatLng({ ...searchLatLng, ...defaultLatLng })
                        })
                } else {
                    setSearchLatLng({ ...searchLatLng, ...defaultLatLng })
                    console.log('Geoloaction이 지원되지 않는 브라우저 입니다.')
                }
            }
        }
        settingDefaultSearch()
    }, [])

    // test용 useEffect
    useEffect(() => {
        console.log("조회요청 보내는 값, 폼데이터로 보내야함")
        console.log("longitude_X", searchLatLng.longitude)
        console.log("latitude_Y", searchLatLng.latitude)
        console.log("searchKeyword", '')
    }, [searchLatLng])

    useEffect(() => {
        if (targetAddress) {
            queryClient.resetQueries('getLatLng')   
        }
    }, [targetAddress])

    useEffect(() => {
        if (isTargeting) {
            getLatLngQuery.refetch()
            setIsTargeting(false)
        }
    }, [isTargeting])

    useEffect(() => {
        // 카카오 api 에서 위도 경도를 반대로 주고 앉아 있음;
        if (getLatLngQuery.isSuccess) {
            console.log("조회결과 (", getLatLngQuery.data.documents[0].y, getLatLngQuery.data.documents[0].x, ")")
            console.log("-------------------------------------------------")
            setSearchLatLng({...searchLatLng, ...{longitude:getLatLngQuery.data.documents[0].y, latitude:getLatLngQuery.data.documents[0].x}})
            sendData(getLatLngQuery.data.documents[0].y, getLatLngQuery.data.documents[0].x)
        }
    }, [getLatLngQuery.isSuccess])

    // 만약 토큰이 없으면 로그인 상태가 아니므로 동네 지정 검색만 가능하게 한다.
    // 토큰이 있어도(로그인상태) 브라우저의 권한을 제공하지 않았으면 동네 지정 검색만 가능하게 한다.
    // 토큰이 있고, 브라우저에게 권한도 제공했으면 위치기반 검색을 가능하게 한다.

    const sendData = (x, y, keyword, language) =>{
        // 내부 값 변경
        formData.append('longitude_X', x);
        formData.append('latitude_Y', y);
        if(keyword){
            formData.append('searchKeyword', '');
        }else{
            formData.append('searchKeyword', keyword);
        }

        if(language){
            formData.append('language', '');
        }else{
            formData.append('language', language);
        }

        console.log("formData", [...formData])
        // TODO sjy 나중에 이 폼데이터를 서버에 보내야함. 네개 맞는지 확인할것. 이름도 좀 확인하자.
    }

    if (getLatLngQuery.isError) {
        return <div>isError.</div>
    }
    if (getLatLngQuery.isLoading) {
        return <div>로딩중입니다.</div>
    }

    return (
        <MainContaniner>
            <SearchContaniner>
                <div>
                    검색창 영역
                </div>
                <div>
                    <div>인기동네버튼영역</div>
                    <div>
                        {townList.hotTown.map((town) => {
                            return <button onClick={() => (onClickGetLatLngHandler(town.townTitle))}>{town.townTitle.split(' ')[2]}</button>
                        })}
                    </div>
                </div>
            </SearchContaniner>
            <MapContaniner>
                <MainMap/>
            </MapContaniner>
            <RoomContaniner>
                모각코방영역
            </RoomContaniner>
        </MainContaniner>
    );
}

export const MainContaniner = styled.div`
    display: flex;
    flex-direction: row;
`
export const SearchContaniner = styled.div`
    background-color: green;
    height: 100vh;
    width: 20vw;
`
export const MapContaniner = styled.div`
    background-color: gray;
    height: 100vh;
    width: 60vw;
`
export const RoomContaniner = styled.div`
    background-color: yellow;
    height: 100vh;
    width: 20vw;
`
export default Main;