import React from 'react'
import { styled } from 'styled-components'

function TutorialTwo() {
  return (
    <>
      <TutorialPageWrap>
        <ImgWrap bg={`${process.env.PUBLIC_URL}/image/tutorialTwoBg.webp`}>
          <p>
            모각코ONː은 접속위치 기반으로 모각코를 만들고<br />
            검색할 수 있는 서비스입니다.
          </p>
          <img src={`${process.env.PUBLIC_URL}/image/tutorialTwoMap.webp`} alt="지도이미지" />
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
    width: 375px;
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

  img {
    position: absolute;
    bottom: 48px;
    right: 103px;
  }
`
export default TutorialTwo