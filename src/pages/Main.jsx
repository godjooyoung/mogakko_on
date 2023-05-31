import React from 'react';
import { styled } from 'styled-components';
import MainHeader from '../components/MainHeader';
import MainSearch from '../components/MainSearch';
import MainMap from '../components/MainMap';
import MainRoom from '../components/MainRoom';
function Main() {

    return (
        <MainContaniner>
            <MainHeader/>
            <MainSearch/>
            <MainMap/>
            <MainRoom/>
        </MainContaniner>
    );
}

export const MainContaniner = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 30vh 30vh 30vh;
    width: 100%;
    height: 100%;
    column-gap: 10px;
    row-gap: 10px;
`

export default Main;