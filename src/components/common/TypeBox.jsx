import React from 'react'
import styled from 'styled-components'

function TypeBox(props) {
  return (
    <>
      <TypeBtnWrap>
        <Dot></Dot>
        <TypeBtn color={props.color}>{props.type}</TypeBtn>
        <span>{props.content}</span>
      </TypeBtnWrap>
    </>
  )
}

export const TypeBtnWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;

  span {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    color: #FFFFFF;
  }
  div {
    margin-left: 10px;
  }
`

export const Dot = styled.div`
  width: 3px;
  height: 3px;
  background-color: #FFFFFF;
  border-radius: 50%;
`

export const TypeBtn = styled.li`
  width: ${(props) => {
    return props.color === '#6DD35E' ? '32px' : '62px'
  }};
  height: 18px;
  background: ${(props) => {
    return props.color
  }};
  border-radius: 3px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
`

export default TypeBox