import React, { useEffect } from 'react'
import { styled } from 'styled-components'
import TutorialOne from '../components/tutorial/TutorialOne'
import TutorialTwo from '../components/tutorial/TutorialTwo'
import TutorialThree from '../components/tutorial/TutorialThree'
function Tutorial() {
  return (
    <TutorialWrap>
      <TutorialOne />
      <TutorialTwo />
      <TutorialThree />
    </TutorialWrap>
  )
}

export const TutorialWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap:131px;
`

export default Tutorial