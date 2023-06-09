import React from 'react';
import { styled } from 'styled-components';
import MainHeader from '../components/MainHeader';
import MainContent from '../components/MainContent';
import MainBest from '../components/MainBest';
function Main() {

    // 수정 필요
    const goToTopHandler = () => {
        console.log("위로 고고")
        window.scroll({
            top : 0,
            behavior : 'smooth'
        })
    }
    return (
        <MainWrap>
        <MainContaniner>
            <MainHeader/>
            <MainContent/>
            <MainBest/>
        </MainContaniner>
        <Top onClick={goToTopHandler} url={`${process.env.PUBLIC_URL}/image/top.png`}></Top>
        </MainWrap>
    );
}

export const MainWrap = styled.div`
    position: relative;
`
export const Top = styled.div`
    width: 60px;
    height: 60px;
    background: #4C5163;
    border-radius: 50%;
    color : white;
    text-align: center;
    overflow: hidden;
	z-index: 9;
    position: sticky;
    bottom: 150px;
    left: 100%;
    background-image: ${(props) =>
    `url('${props.url}')`
    };
    cursor: pointer;
    &:hover {
        transform: scale(1.03);
    }
    &:active {
        transform: scale(1);
    }
`
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