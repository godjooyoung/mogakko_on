import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

function Tutorial() {
    const navigate = useNavigate();
    const stepRefs = useRef([])
    const [isVisibles, setIsVisibles] = useState(Array(12).fill(false));
    
    useEffect(() => {
        
        const handleScroll = () => {
            // 스크롤 이벤트 처리 로직 작성
            console.log('스크롤 이벤트 발생!');
            stepRefs.current.forEach((stepRef, idx) => {
                //console.log("stepRef Rect["+idx+"]", stepRef.getBoundingClientRect().top, "윈도우 내부 높이",window.innerHeight, "윈도우 내부 높이*0.1",window.innerHeight*0.1, "윈도우 내부 높이*0.8",window.innerHeight*0.8)
                // 위치 정보를 이용한 추가 처리 작성
                if((stepRef.getBoundingClientRect().top > window.innerHeight*0.1)&&(stepRef.getBoundingClientRect().top < window.innerHeight*0.8)){
                    console.log(idx+"번째가 화면에 진입함!!!")
                    setIsVisibles((prevState) => {
                        const newState = Array(12).fill(false)
                        newState[idx] = true
                        return newState
                    })

                }
            })

        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    const goHome = () => {
        navigate('/')
    }
    return (
        <>
            <NormalHeader>{/* 헤더 */}
                <div>{/* 글로벌 위드 */}
                    <h1>모각코 ONː 튜토리얼</h1>
                    <p>
                        이 페이지는 모각코 ONː을 처음 사용하시는 분들에게<br />간단한 설명을 드리는 튜토리얼 페이지 입니다.<br />
                        언제든지 스킵 하실 수 있으며,<br />
                        원하신다면 마이페이지에서 다시 보실 수 도 있습니다.<br />
                        아래로 스크롤 헤주세요.
                    </p>
                </div>
            </NormalHeader>
            <ScrollContent>
                <ScrollGraphic>{/* 스크롤 이미지들 */}
                    {/* 이미지 아이템 0*/} <GraphicItem isVisible={isVisibles[0]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial00.gif`} alt="튜토리얼 사진 설명 00"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 1*/} <GraphicItem isVisible={isVisibles[1]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial01.gif`} alt="튜토리얼 사진 설명 01"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 2*/} <GraphicItem isVisible={isVisibles[2]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial02.gif`} alt="튜토리얼 사진 설명 02"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 3*/} <GraphicItem isVisible={isVisibles[3]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial03.gif`} alt="튜토리얼 사진 설명 03"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 4*/} <GraphicItem isVisible={isVisibles[4]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial04.gif`} alt="튜토리얼 사진 설명 04"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 5*/} <GraphicItem isVisible={isVisibles[5]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial05.png`} alt="튜토리얼 사진 설명 05"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 6*/} <GraphicItem isVisible={isVisibles[6]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial06.gif`} alt="튜토리얼 사진 설명 06"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 7*/} <GraphicItem isVisible={isVisibles[7]}><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial07.gif`} alt="튜토리얼 사진 설명 07"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 8*/} <GraphicItem isVisible={isVisibles[8]} ><div>empty</div></GraphicItem>
                    {/* 이미지 아이템 9*/} <GraphicItem isVisible={isVisibles[9]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial08.png`} alt="튜토리얼 사진 설명 08"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 10*/} <GraphicItem isVisible={isVisibles[10]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial09.png`} alt="튜토리얼 사진 설명 09"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 11*/} <GraphicItem isVisible={isVisibles[11]} ><div>empty</div></GraphicItem>
                </ScrollGraphic>
                <ScrollText>{/* 스크롤 글자 글로벌 위드*/}
                    {/* 글자 아이템 0*/}<Step ref={(ref) => (stepRefs.current[0] = ref)} ><p><b>모각코 ONː</b>은 쉽게 모각코를 검색하고<br />생성할 수 있는 서비스 입니다.</p></Step>
                    {/* 글자 아이템 1*/}<Step ref={(ref) => (stepRefs.current[1] = ref)}><p><b>모각코 ONː</b>은 현재 접속 위치 중심으로 12km 반경 내로<br />모각코를 검색하고 생성할 수 있습니다.</p></Step>
                    {/* 글자 아이템 2*/}<Step ref={(ref) => (stepRefs.current[2] = ref)}><p>모각코 방을 만들어 볼까요?</p></Step>
                    {/* 글자 아이템 3*/}<Step ref={(ref) => (stepRefs.current[3] = ref)}><p>함께 모각코 하고 싶은 언어와 최대 인원을 선택할 수 있어요.</p></Step>
                    {/* 글자 아이템 4*/}<Step ref={(ref) => (stepRefs.current[4] = ref)}><p>모각코방에 참여해서 함께 모각코를 즐겨 볼까요?</p></Step>
                    {/* 글자 아이템 5*/}<Step ref={(ref) => (stepRefs.current[5] = ref)}><p>모각코 방에 입장하면 타이머가 동작해요. 함께 코딩한 시간을 기록해봐요!</p></Step>
                    {/* 글자 아이템 6*/}<Step ref={(ref) => (stepRefs.current[6] = ref)}><p>실시간 채팅을 주고 받을 수 있고</p></Step>
                    {/* 글자 아이템 7*/}<Step ref={(ref) => (stepRefs.current[7] = ref)}><p>화면 공유도 할 수 있어요.</p></Step>
                    {/* 글자 아이템 8*/}<Step ref={(ref) => (stepRefs.current[8] = ref)}><p>마이페이지로 가볼까요?</p></Step>
                    {/* 글자 아이템 9*/}<Step ref={(ref) => (stepRefs.current[9] = ref)}><p>지금까지 모각코온에 참여한 내용을 편하게 확인 가능해요.</p></Step>
                    {/* 글자 아이템 10*/}<Step ref={(ref) => (stepRefs.current[10] = ref)}><p>해당 튜토리얼은 마이페이지 하단에서 다시 확인 가능해요.</p></Step>
                    {/* 글자 아이템 11*/}<Step ref={(ref) => (stepRefs.current[11] = ref)}><LastMsgP onClick={goHome}>이제 <b>모각코 ONː</b>을 사용하러 가볼까요?</LastMsgP></Step>
                </ScrollText>
            </ScrollContent>
            <NormalContent>
                {/* 그냥 컨텐츠 글로벌 위드*/}
                {/* <h2>모각코 온을 사용해주셔서 감사합니다.</h2> */}
                {/* <p>여러분의 ~~~~~~~~~~~~~~~~</p> */}
            </NormalContent>
        </>

    );
}

export const NormalHeader = styled.div`
    div {
        width: 900px;
        margin: 0 auto;
        color : #ffffff;
        padding: 0 1rem;
    }
    h1 {
        font-size: 50px;
        font-family: Pretendard;
        font-weight: 700;
        text-align: center;
        margin :21px;
    }
    p{
        text-align: center;
        font-size: 17px;
        font-family: Pretendard;
        font-weight: 500;
        line-height: 166%;
    }
`
export const ScrollContent = styled.section`
    
`

export const NormalContent = styled.section`
    width: 900px;
    margin: 0 auto;
    color : #ffffff;
    padding: 0 1rem;
    height: 35vh;
    

`

// ScrollContent 자식
export const ScrollGraphic = styled.div`
    position: sticky;
    top: 0;
    height: 100vh;
`
export const GraphicItem = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: all 0.5s;
    opacity : ${(props) => {
        return props.isVisible ? 1 : 0;
    }};
    div {
        width: 933px;
        height: 679px;
        background-color: transparent;
    }
`
export const SceneImg = styled.img`
    max-width: 100%;
    width: 933px;
    height: auto;
    max-height: 100vh;
    border-radius: 20px;
`

export const ScrollText = styled.div`
    width: 900px;
    margin: 0 auto;
    padding: 0 1rem;

    position: relative;
`

export const Step = styled.div`
    background-color: #F9F9FA;
    border-radius: 10px;
    padding: 20px 21px;
    margin-bottom: 60vh;
    p {
        font-size: 15px;
        font-family: Pretendard;
    }
    width: fit-content;
    margin: 0 auto 60vh;
`

export const LastMsgP = styled.p`
    cursor: pointer;
    &:hover {
        transition: 0.3s;
        transform: scale(1.03);
    }
    &:active {
        transition: 0.3s;
        transform: scale(1);
    }
`

export default Tutorial;