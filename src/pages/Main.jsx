import React from 'react';
import { styled } from 'styled-components';
import MainHeader from '../components/MainHeader';
import MainContent from '../components/MainContent';
function Main() {

    return (
        <MainContaniner>
            <MainHeader/>
            <MainContent/>
        </MainContaniner>
    );
}

export const MainContaniner = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
    width: 100%;
    height: 100%;
    column-gap: 10px;
    row-gap: 10px;
`

export default Main;