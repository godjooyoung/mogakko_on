import React, { useEffect, useState } from 'react'
import MainMap from './MainMap'
import MainRoom from './MainRoom'
import MainSearch from './MainSearch'
import { styled } from 'styled-components'
import { useSelector } from 'react-redux'
import { useMutation } from 'react-query'
import { getRoomList } from '../axios/api/room'

function MainContent() {

    
    // 전역
    const searchInfo = useSelector((state) => {
        //console.log("searchInfo", state.searchInfo)
        return state.searchInfo
    })

    // 내부
    const [timer, setTimer] = useState(0); // 디바운싱 타이머
    const [roomList, setRoomList] = useState([])
    
    // TODO 조회요청 서버에 보내서 결과 프롭스로 내려주기
    const roomListMutation = useMutation(getRoomList, {
        onSuccess: (response) => {
            if(response.message === '근처에 모각코가 없습니다.'){
                setRoomList([])
            }else{
                setRoomList(response.data)
            }
        }
    })

    useEffect(()=>{
        if (timer) {
            console.log('clear timer');
            clearTimeout(timer);
        }
        const newTimer = setTimeout(async () => {
            try {
                await roomListMutationCall()
            } catch (e) {
                console.error('error', e);
            }
        }, 1000);

        setTimer(newTimer);

        // 방 목록 조회
        const roomListMutationCall = () => {
            roomListMutation.mutate(searchInfo)
        }
        
    },[searchInfo])

    // // TODO sjy 조회요청 서버에 보내서 결과 프롭스로 내려주기
    // const roomList = [
    //     {
    //         "createdAt": "2023-05-30T21:53:14.647244",
    //         "modifiedAt": "2023-05-30T21:53:14.647244",
    //         "sessionId": "ses_SYQM0lRmEl",
    //         "title": "침묵의 모각코방 바로 화면 공유 ㄱ",
    //         "password": "1234",
    //         "language": "JAVA",
    //         "masterMemberId": 3,
    //         "maxMembers": 4,
    //         "cntMembers": 1,
    //         "roomDeleteTime": null,
    //         "lat" : 37.55471599685624,
    //         "lon" : 126.86886734023552,
    //         "neighborhood": "서울시 강서구 염창동",
    //         "opened": false,
    //         "deleted": false,
    //     },
    //     {
    //         "createdAt": "2023-05-30T21:53:14.647244",
    //         "modifiedAt": "2023-05-30T21:53:14.647244",
    //         "sessionId": "ses_SYQM0lRmEl",
    //         "title": "침묵의 모각코방 바로 화면 공유 ㄱ",
    //         "password": "1234",
    //         "language": "JAVA",
    //         "masterMemberId": 3,
    //         "maxMembers": 4,
    //         "cntMembers": 1,
    //         "roomDeleteTime": null,
    //         "lat": 37.60787909179756,
    //         "lon": 127.0873291901848,
    //         "neighborhood": "서울시 강서구 등촌동",
    //         "opened": false,
    //         "deleted": false,
    //     },
    //     {
    //         "createdAt": "2023-05-30T21:53:14.647244",
    //         "modifiedAt": "2023-05-30T21:53:14.647244",
    //         "sessionId": "ses_SYQM0lRmEl",
    //         "title": "멋진 모각코방",
    //         "password": "1234",
    //         "language": "JAVA",
    //         "masterMemberId": 3,
    //         "maxMembers": 4,
    //         "cntMembers": 1,
    //         "roomDeleteTime": null,
    //         "lat": 37.556516445779762,
    //         "lon": 126.86748345152914,
    //         "neighborhood": "서울시 강서구 염창동",
    //         "opened": false,
    //         "deleted": false,
    //     }
    // ]

    return (
        <MainContentWrap>
            <MainSearch />
            <MainMap roomList={roomList}/>
            <MainRoom roomList={roomList}/>
        </MainContentWrap>
    );
}

export const MainContentWrap = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
`

export default MainContent
