import React, { useEffect, useRef, useState } from 'react';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { checkTutorial } from '../axios/api/tutorial'
import { getCookie } from '../cookie/Cookie';

function Tutorial() {
    const navigate = useNavigate();
    const stepRefs = useRef([])
    const [isVisibles, setIsVisibles] = useState([true, ...Array(12).fill(false)])

    // query
    const queryClient = useQueryClient()
    // 최초확인 업데이트
    const updateCheckTutorialMutation = useMutation(checkTutorial, {
        onSuccess: (response) => {
            console.log('========================== 최초 접속 여부 업데이트')
        },
    })
    // 최초확인 업데이트 뮤테이션 콜
    const updateCheckTutorialMutationCall = () => {
        updateCheckTutorialMutation.mutate()
    }

    //버튼 파동
    const [rippleX, setRippleX] = useState(0);
    const [rippleY, setRippleY] = useState(0);

    const handleButtonClick = (event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left) / button.offsetWidth;
        const y = (event.clientY - rect.top) / button.offsetHeight;

        setRippleX(x);
        setRippleY(y);
    };


    useEffect(() => {
        const handleScroll = () => {
            console.log('스크롤 이벤트 발생!');
            stepRefs.current.forEach((stepRef, idx) => {
                if (stepRef && stepRef.getBoundingClientRect()) {
                    if (
                        stepRef.getBoundingClientRect().top > window.innerHeight * 0.1 &&
                        stepRef.getBoundingClientRect().top < window.innerHeight * 0.8
                    ) {
                        console.log(idx + '번째가 화면에 진입함!!!');
                        setIsVisibles((prevState) => {
                            const newState = Array(13).fill(false);
                            newState[idx] = true;
                            return newState;
                        });
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);

        if (getCookie('token')) {
            updateCheckTutorialMutationCall()
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    const goHome = () => {
        navigate('/')
        window.scrollTo(0, 0)
    }

    return (
        <>
            {/* <NormalHeader>
                <div>
                    <h1>모각코 ONː 튜토리얼</h1>
                    <p>
                        이 페이지는 모각코 ONː을 처음 사용하시는 분들에게<br />간단한 설명을 드리는 튜토리얼 페이지 입니다.<br />
                        언제든지 스킵 하실 수 있으며,<br />
                        원하신다면 마이페이지에서 다시 보실 수 도 있습니다.<br />
                        아래로 스크롤 헤주세요.
                    </p>
                </div>
            </NormalHeader> */}
            <FDivChildSec onClick={goHome}>
                <p>SKIP →</p>
            </FDivChildSec>
            <ScrollContent>
                <ScrollGraphic>{/* 스크롤 이미지들 */}
                    {/* 이미지 아이템 0*/}
                    <GraphicItem isVisible={isVisibles[0]} >
                        <FirstDiv>
                            <FDivChildFir>
                                <TopContent>
                                    <h1>모각코 ONː 튜토리얼</h1>
                                    <pre>
                                        이 페이지는 모각코 ONː을 처음 사용하시는 분을 위한<br />
                                        간단한 설명을 드리는 튜토리얼 페이지 입니다.<br />
                                    </pre>
                                    <pre>
                                        언제든지 스킵 하실 수 있으며,<br />
                                        원하신다면 마이페이지에서 다시 보실 수 도 있습니다.<br />
                                    </pre>
                                </TopContent>
                                <BottomContent>
                                    <p>아래로 스크롤 해주세요.</p>
                                    <img src={`${process.env.PUBLIC_URL}/image/tutorial/underArrow.gif`} alt="아래 화살표"></img>
                                </BottomContent>
                            </FDivChildFir>
                        </FirstDiv>
                    </GraphicItem>
                    {/* 이미지 아이템 1*/} <GraphicItem isVisible={isVisibles[1]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial00.gif`} alt="튜토리얼 사진 설명 00"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 2*/} <GraphicItem isVisible={isVisibles[2]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial01.gif`} alt="튜토리얼 사진 설명 01"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 3*/} <GraphicItem isVisible={isVisibles[3]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial02.gif`} alt="튜토리얼 사진 설명 02"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 4*/} <GraphicItem isVisible={isVisibles[4]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial03.gif`} alt="튜토리얼 사진 설명 03"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 5*/} <GraphicItem isVisible={isVisibles[5]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial04.gif`} alt="튜토리얼 사진 설명 04"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 6*/} <GraphicItem isVisible={isVisibles[6]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial05.png`} alt="튜토리얼 사진 설명 05"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 7*/} <GraphicItem isVisible={isVisibles[7]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial06.gif`} alt="튜토리얼 사진 설명 06"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 8*/} <GraphicItem isVisible={isVisibles[8]}><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial07.gif`} alt="튜토리얼 사진 설명 07"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 9*/} <GraphicItem isVisible={isVisibles[9]} ><div></div></GraphicItem>
                    {/* 이미지 아이템 10*/} <GraphicItem isVisible={isVisibles[10]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial08.gif`} alt="튜토리얼 사진 설명 08"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 11*/} <GraphicItem isVisible={isVisibles[11]} ><SceneImg src={`${process.env.PUBLIC_URL}/image/tutorial/tutorial09.png`} alt="튜토리얼 사진 설명 09"></SceneImg></GraphicItem>
                    {/* 이미지 아이템 12*/} <GraphicItem isVisible={isVisibles[12]} ><div></div></GraphicItem>
                </ScrollGraphic>
                <ScrollText>{/* 스크롤 글자 글로벌 위드*/}
                    {/* 글자 아이템 0*/}<HideStep ref={(ref) => (stepRefs.current[0] = ref)} ><p></p></HideStep>
                    {/* 글자 아이템 1*/}<Step ref={(ref) => (stepRefs.current[1] = ref)} ><p><b>모각코 ONː</b>은 쉽게 모각코를 검색하고<br />생성할 수 있는 서비스 입니다.</p></Step>
                    {/* 글자 아이템 2*/}<Step ref={(ref) => (stepRefs.current[2] = ref)}><p><b>모각코 ONː</b>은 현재 접속 위치 중심으로 12km 반경 내로<br />모각코를 검색하고 생성할 수 있습니다.</p></Step>
                    {/* 글자 아이템 3*/}<Step ref={(ref) => (stepRefs.current[3] = ref)}><p>모각코 방을 만들어 볼까요?</p></Step>
                    {/* 글자 아이템 4*/}<Step ref={(ref) => (stepRefs.current[4] = ref)}><p>함께 모각코 하고 싶은 언어와 최대 인원을 선택할 수 있어요.</p></Step>
                    {/* 글자 아이템 5*/}<Step ref={(ref) => (stepRefs.current[5] = ref)}><p>모각코방에 참여해서 함께 모각코를 즐겨 볼까요?</p></Step>
                    {/* 글자 아이템 6*/}<Step ref={(ref) => (stepRefs.current[6] = ref)}><p>모각코 방에 입장하면 타이머가 동작해요. 함께 코딩한 시간을 기록해봐요!</p></Step>
                    {/* 글자 아이템 7*/}<Step ref={(ref) => (stepRefs.current[7] = ref)}><p>실시간 채팅을 주고 받을 수 있고</p></Step>
                    {/* 글자 아이템 8*/}<Step ref={(ref) => (stepRefs.current[8] = ref)}><p>모각코에 참여해 화면공유로 코드리뷰도 하고 <br /> <b>코드에디터</b>도 편하게 사용해보세요.</p></Step>
                    {/* 글자 아이템 9*/}<Step ref={(ref) => (stepRefs.current[9] = ref)}><p>마이페이지로 가볼까요?</p></Step>
                    {/* 글자 아이템 10*/}<Step ref={(ref) => (stepRefs.current[10] = ref)}><p>지금까지 모각코온에 참여한 내용을 한눈에 확인 가능해요.</p></Step>
                    {/* 글자 아이템 11*/}<Step ref={(ref) => (stepRefs.current[11] = ref)}><p>해당 튜토리얼은 마이페이지 하단에서 다시 확인 가능해요.</p></Step>
                    {/* 글자 아이템 12*/}<GoBtnWrap ref={(ref) => (stepRefs.current[12] = ref)}>
                        <p>이제 <b>모각코 ONː</b>을 사용하러 가볼까요?</p>
                        <GoRoomButton onClick={(event) => {
                            handleButtonClick(event)
                            setTimeout(() => {
                                goHome()
                            }, 500)
                        }}
                            rippleX={rippleX}
                            rippleY={rippleY}
                        ><img src={`${process.env.PUBLIC_URL}/image/tutorialOn.svg`} alt="튜토리얼 on이미지" /></GoRoomButton>
                    </GoBtnWrap>
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
    height: calc(100vh - 79px);
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
        width: 1200px;
        height: 870px;
        //background-color: transparent;
    }
`
export const FirstDiv = styled.div`
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
`

export const FDivChildFir = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export const TopContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h1{
        font-size: 40px;
        font-family: 'Pretendard';
        font-weight: 700;
        margin-bottom: 59px;
        color: #ffffff;
    }
    pre {
        font-size: 15px;
        font-family: 'Pretendard';
        color: #ffffff;
        text-align: center;
        margin-bottom: 40px;
        line-height: 1.4rem;
    }
`
export const BottomContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p {
        margin-top: -100px;
        color: #ffffff;
        text-align: center;
        font-size: 15px;
        font-family: 'Pretendard';
    }
    img {
        margin-top: 30px;
        margin-bottom: 120px;
    }
    flex: 0;
`
export const FDivChildSec = styled.div`
    position: relative;
    display: flex;
    justify-content: end;
    cursor: pointer;
    z-index: 1;
    p{
        font-size: 19px;
        font-family: 'Pretendard';
        position: fixed;
        bottom: 120px;
        color: #FFFFFF;
    }
`

export const SceneImg = styled.img`
    max-width: 100%;
    width: 933px;
    height: auto;
    max-height: calc(100vh - 79px);
    border-radius: 20px;
`

export const ScrollText = styled.div`
    width: 900px;
    margin: 0 auto;
    padding: 0 1rem;

    position: relative;
`

export const HideStep = styled.div`
    background-color: transparent;
    width: 10px;
    height: 10px;
    margin-bottom: 60vh;
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
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
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

export const GoBtnWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 0 auto 20vh;

    p {
        font-weight: 500;
        font-size: 30px;
        color: #FFFFFF;
    }

    img {
        width: 45px;
    }
`

export const GoRoomButton = styled.button`
    position: relative;
    width: 300px;
    height: 80px;
    overflow: hidden;
    border: none;
    border-radius: 35px;
    background-image: linear-gradient(90deg, #00F0FF, #26b9ff);
    /* background-image: linear-gradient(90deg, #26b9ff, #00F0FF);*/
    /* background-color: var(--po-de); */
    color: #3d3935;
    font-family: 'Pretendard';
    border-radius: 52px;
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    outline: none;
    cursor: pointer;
    &:hover {
        box-shadow: 0px 0px 20px -5px rgba(0, 0, 0, .2);
    }
    &::before{
        opacity: 0;
        position: absolute;
        top: calc(100% * ${(props) => props.rippleX});
        left: calc(100% * ${(props) => props.rippleX});
        transform: translate(-50%, -50%) scale(1);
        padding: 50%;
        border-radius: 50%;
        background-color: #fff;
        content: '';
        transition: transform 1s, opacity 1s;
    }
    &:active::before {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0);
        transition: 0s;
    }
    &::after {
        opacity: 0;
        position: absolute;
        top: calc(100% * ${(props) => props.rippleY});
        left: calc(100% * ${(props) => props.rippleX});
        transform: translate(-50%, -50%) scale(1);
        padding: 50%;
        border-radius: 50%;
        background-color: #fff;
        content: '';
        transition: transform 2s, opacity 2s;
    }
    &:active::after {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0);
        transition: 0s;
    }

    &:hover {
        transition: 0.3s;
        transform: scale(1.03);
    }
`

export default Tutorial;