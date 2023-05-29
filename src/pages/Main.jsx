import React from 'react';
import { styled } from 'styled-components';
import MainSearch from '../components/MainSearch';
import MainMap from '../components/MainMap';
import MainRoom from '../components/MainRoom';
function Main() {

    return (
        <MainContaniner>
            <MainSearch/>
            <MainMap/>
            <MainRoom/>
        </MainContaniner>
    );
}

export const MainContaniner = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
`

export default Main;