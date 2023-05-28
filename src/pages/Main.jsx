import React from 'react';
import { styled } from 'styled-components';
import MainSearch from '../components/MainSearch';
import MainMap from '../components/MainMap';
function Main() {

    return (
        <MainContaniner>
            <MainSearch/>
            <MainMap/>
            <RoomContaniner>
                모각코방영역
            </RoomContaniner>
        </MainContaniner>
    );
}

export const MainContaniner = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
`
export const RoomContaniner = styled.div`
    background-color: yellow;
    width: 20%;
    height: 100vh;
`
export default Main;