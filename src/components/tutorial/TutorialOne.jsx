import React from 'react'
import { styled } from 'styled-components'
function TutorialOne() {
  return (
    <>
      <TutorialPageWrap>
          <p>
            모각코ONː을 처음 이용하시는 여러분들!<br />
            모각코ONː의 사용법과 기능을 소개할게요!<br />
            아래로 스크롤해주세요.
          </p>
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

  p {
    width: 315px;
    height: 112px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #F9F9FA;
    border-radius: 10px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    color: #000000;
    line-height: 24px;
  }
`

export default TutorialOne