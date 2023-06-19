import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import MainHeader from '../components/MainHeader';
import MainContent from '../components/MainContent';
import MainBest from '../components/MainBest';
import Header from '../components/common/Header';
import SigninPopup from '../components/common/SigninPopup';
import NoticePopup from '../components/common/NoticePopup';
import { getCookie } from '../cookie/Cookie'
function Main() {

    // 공지팝업
    const [showPopup, setShowPopup] = useState(false);

    const disablePopup = () => {
        localStorage.setItem('hidePopup', true);
        closeNoticePopup();
    };

    const closeNoticePopup = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        if (getCookie("token")) {
            const hidePopup = localStorage.getItem('hidePopup');
            if (!hidePopup) {
                setShowPopup(true);
            }
        }
    }, []);

    const [isOpen, setIsOpen] = useState(false)
    const popupOpenHander = () => {
        setIsOpen(true)
    }
    const popupCloseHander = () => {
        setIsOpen(false)
    }

    const goToTopHandler = () => {
        // console.log("위로 고고")
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    }
    return (
        <>
            {showPopup && (
                <NoticePopup closeHandler={closeNoticePopup} disableHandler={disablePopup} />
            )}

            {isOpen ?
                <>
                    {/* 팝업 */}
                    <SigninPopup closeHander={popupCloseHander} />
                </> : <></>

            }
            <MainWrap>
                <MainContaniner>
                    <Header pos={true} />
                    <MainHeader openHander={popupOpenHander} />
                    <MainContent openHander={popupOpenHander} />
                    <MainBest openHander={popupOpenHander} />
                </MainContaniner>
                <Top onClick={goToTopHandler} url={`${process.env.PUBLIC_URL}/image/goToTopBtn.webp`}></Top>
            </MainWrap>
        </>
    );
}

export const MainWrap = styled.div`
    position: relative;
`
export const Top = styled.div`
    width: 60px;
    height: 60px;
    background: var(--bg-li);
    border-radius: 50%;
    color : white;
    text-align: center;
    overflow: hidden;
	z-index: 1;
    position: sticky;
    bottom: 150px;
    left: 100%;
    background-image: ${(props) =>
        `url('${props.url}')`
    };
    cursor: pointer;
    &:hover {
        transition: 0.3s;
        transform: scale(1.03);
    }
    &:active {
        transition: 0.2s;
        transform: scale(1);
    }
    background-position: center;
    background-repeat: no-repeat;
`
export const MainContaniner = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
    width: 100%;
    height: 100%;
    column-gap: 10px;
    row-gap: 10px;
`

export default Main;