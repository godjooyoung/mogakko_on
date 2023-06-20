import React, { useEffect, useState } from 'react'
import { styled, keyframes, css } from 'styled-components'
function TutorialThree() {
  const [gradientanimate, setGradientAnimate] = useState(false);
  const [downanimate, setDownAnimate] = useState(false);
  
  useEffect(() => {
    setDownAnimate(true);
    const timer = setTimeout(() => {
      setGradientAnimate(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <TutorialPageWrap>
        <ImgWrap bg={`${process.env.PUBLIC_URL}/image/tutorialThreeBg.webp`}>
          <p>
            현재 접속하신 위치에서 12km 반경 내의 모각코방<br />
            을 검색하거나 모각코방을 만들 수도 있어요
          </p>
          <MapImg src={`${process.env.PUBLIC_URL}/image/tutorialThreeNoPinMap.png`} alt="지도이미지" />
          <PinImg src={`${process.env.PUBLIC_URL}/image/tutorialThreePin.webp`} alt="지도 핀 이미지" animate={downanimate}/>
          {/* <HighLightImg src={`${process.env.PUBLIC_URL}/image/tutorialThreeHighlight.webp`} alt="하이라이트 이미지" /> */}
          <HighLightImg animate={gradientanimate} />
        </ImgWrap>
      </TutorialPageWrap>
    </>
  )
}

export const TutorialPageWrap = styled.div`
  width: 1280px;
  height: 935px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100vh - 79px);
`

export const ImgWrap = styled.div`
  width: 933px;
  height: 679px;
  position: relative;
  background-image: url(
    ${(props) => {
    return props.bg
  }});

  p {
    width: 382px;
    height: 77px;
    position: absolute;
    top: 228px;
    left: 226px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #F9F9FA;
    border-radius: 10px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    color: #000000;
    padding: 20px;
    line-height: 24px;
  }
`

export const MapImg = styled.img`
  position: absolute;
  bottom: 48px;
  right: 103px;
`

const downAnimation = keyframes`
  0% {
    transform: translateY(-500px);
  }
  100% {
    transform: translateY(0);
  }
`

export const PinImg = styled.img`
  position: absolute;
  bottom: 178px;
  right: 201px;
  z-index: 3;
  transform: translateY(-500px);
  ${({ animate }) =>
    animate &&
    css`
      animation: ${downAnimation} 1s forwards;
    `};
  /* animation: ${downAnimation} 1s forwards; */
`

const gradientAnimation = keyframes`
  0% {
    background: transparent;
  }
  10% {
    background: radial-gradient(rgb(14 165 233), transparent 10%);
  }
  20% {
    background: radial-gradient(rgb(14 165 233), transparent 15%);
  }
  30% {
    background: radial-gradient(rgb(14 165 233), transparent 25%);
  }
  40% {
    background: radial-gradient(rgb(14 165 233), transparent 35%);
  }
  50% {
    background: radial-gradient(rgb(14 165 233), transparent 46%);
  }
  60% {
    background: radial-gradient(rgb(14 165 233), transparent 55%);
  }
  70% {
    background: radial-gradient(rgb(14 165 233), transparent 65%);
  }
  90% {
    background: radial-gradient(rgb(14 165 233), transparent 75%);
  }
  100% {
    background: radial-gradient(rgb(14 165 233), transparent 80%);
  }
`;

export const HighLightImg = styled.div`
  width: 208px;
  height: 208px;
  position: absolute;
  bottom: 100px;
  right: 115px;
  border-radius: 50%;
  background: transparent;
  ${({ animate }) =>
    animate &&
    css`
      animation: ${gradientAnimation} 1.5s forwards;
    `};
`
export default TutorialThree