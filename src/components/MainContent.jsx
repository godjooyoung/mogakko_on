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
            // console.log("메인 컨텐트 검색 결과 ", response)
            // console.log("메인 컨텐트 검색 결과 배열 ", response.data)
            if (response.message === '근처에 모각코가 없습니다.') {
                setRoomList([])
            } else {
                setRoomList(response.data)
            }
        }
    })

    useEffect(() => {
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

    }, [searchInfo])



    return (
        <MainContentWrap>
            <MainSearch />
            <MainMap roomList={roomList} />
            <MainRoom roomList={roomList} />
        </MainContentWrap>
    );
}

export const MainContentWrap = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: max-content;
    column-gap: 24px;
    row-gap: 64px;
`

export default MainContent
