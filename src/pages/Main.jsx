import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie, removeCookie } from '../cookie/Cookie';
import { styled } from 'styled-components';
import { useQuery, useQueryClient } from 'react-query';
import { getLatLng } from '../axios/api/kakao'
import MainMap from '../components/MainMap';
function Main() {

    // 기본 좌표값 (전역)
    const defaultLatLng = useSelector((state) => {
        console.log("defaultLatLng", state.userLocation)
        return state.userLocation
    })

    // 내부 states
    // 로그인 여부
    const [isLogin, setIsLogin] = useState(false)
    
    // 검색 좌표값
    const [searchLatLng, setSearchLatLng] = useState(defaultLatLng)

    // 조회값을 담는 폼 데이터
    const formData = new FormData();
    
    // 리액트 쿼리
    const queryClient = useQueryClient();
    
    // 주소 -> 좌표값 변환 api call
    const [isTargeting, setIsTargeting] = useState(false)
    const [targetAddress, setTargetAddress] = useState(null)
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
                { townTitle: '서울 관악구 신림동' },
                { townTitle: '서울 마포구 합정동' }
            ],
        }
    )

    // 동네 버튼 클릭 이벤트
    const onClickGetLatLngHandler = (adress) => {
        setIsTargeting(true)        // 쿼리 실행 여부 변경
        setTargetAddress(adress)    // 현재 클릭된 동네의 주소
    }

    // 언어 버튼 클릭 이벤트
    const onClickLanguageHandler = (language) => {
        
    }

    useEffect(() => {
        // 로그인 여부
        const checkLoginStatus = async () => {
            // TODO sjy 백에서 넘겨주는 토큰 어떤 이름으로 저장할지 정해지면 변경할것. jwt? token? tk?
            const token = await getCookie("token");
            setIsLogin(token ? true : false);
        };
        checkLoginStatus()

        // 만약 토큰이 없으면 로그인 상태가 아니므로 동네 지정 검색만 가능하게 한다.
        // 토큰이 있어도(로그인상태) 브라우저의 권한을 제공하지 않았으면 동네 지정 검색만 가능하게 한다.
        // 토큰이 있고, 브라우저에게 권한도 제공했으면 위치기반 검색을 가능하게 한다.
        // 로그인 여부에 따른 기본 검색값 설정
        const settingDefaultSearch = () => {
            if (!isLogin) {
                console.log("[INFO] 로그인을 하지 않은 사용자 입니다. 기본 조회위치를 지정합니다. (", isLogin,")")
                setSearchLatLng({ ...defaultLatLng })
            } else {
                console.log("[INFO] 로그인한 사용자 입니다.(", isLogin,")")
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            console.log("[INFO] 현재 접속된 위치로 조회위치를 변경합니다.")
                            setSearchLatLng({
                                ...searchLatLng, ...{
                                    longitude: position.coords.longitude,
                                    latitude: position.coords.latitude
                                }
                            })
                        },
                        error => {
                            console.log("[INFO] 현재 접속된 위치를 받아올 수 없습니다. 기본 조회위치를 지정합니다.")
                            console.log("[ERROR]", error)
                            setSearchLatLng({ ...searchLatLng, ...defaultLatLng })
                        })
                } else {
                    setSearchLatLng({ ...searchLatLng, ...defaultLatLng })
                    console.log('[INFO] Geoloaction이 지원되지 않는 브라우저 입니다. 기본 조회위치를 지정합니다.')
                }
            }
        }
        settingDefaultSearch()
    }, [isLogin])

    useEffect(() => {
        // console.log("조회요청 보내는 값, 폼데이터로 보내야함")
        // console.log("longitude_X", searchLatLng.longitude)
        // console.log("latitude_Y", searchLatLng.latitude)
        // console.log("searchKeyword", '')
    }, [searchLatLng])

    // 버튼을 클릭해서 좌표값을 얻어와야 하는 주소가 변경된 경우
    useEffect(() => {
        if (targetAddress) {
            queryClient.resetQueries('getLatLng')  // 기존 조회 결과를 초기화
            setTargetAddress(null)                 // 변환 대상 주소값 초기화
        }
    }, [targetAddress])

    // 쿼리 실행 여부가 변경되었고 true 일 경우
    useEffect(() => {
        if (isTargeting) {
            getLatLngQuery.refetch() // 선택된 주소값을 좌표값으로 반환하는 쿼리 재실행
            setIsTargeting(false)    // 쿼리 실행 여부 초기화
        }
    }, [isTargeting])

    // 카카오 주소->좌표 성공 시 수행할 로직
    useEffect(() => {
        // 카카오 api 에서 위도 경도를 반대로 줘서 반대로 일단 받음. 
        if (getLatLngQuery.isSuccess) {
            console.log("[INFO] 좌표 요청 결과 (", getLatLngQuery.data.documents[0].y, getLatLngQuery.data.documents[0].x, ")")
            // 조회 좌표값 설정
            setSearchLatLng({...searchLatLng, ...{longitude:getLatLngQuery.data.documents[0].y, latitude:getLatLngQuery.data.documents[0].x}})
            // 데이터 조회하기
            sendData(getLatLngQuery.data.documents[0].y, getLatLngQuery.data.documents[0].x)
        }
    }, [getLatLngQuery.isSuccess])
    
    
    // TODO sjy 나중에 이 폼데이터를 서버에 보내야함. 
    // 서버에 폼 데이터 보내기
    const sendData = (x, y, keyword, language) =>{
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
        console.log("[INFO] Send formData ", [...formData])
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
                {/* TODO sjy 나중에 검색 결과도 내려줘야함. 핀 찍어야 해서. 일단 지금은 검색된 위치로 좌표값만 옮겨주자. */}
                <MainMap searchLatLng={searchLatLng}/>
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