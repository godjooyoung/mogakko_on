import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TypeBox from './TypeBox'
function NoticePopup(props) {

  const noticeItem = [
    { date: '2023.06.20', noticeTitle: '사용자 편의성 개선' },
    { date: '2023.06.20', noticeTitle: '신규 기능 추가 및 사용자 편의성 개선' },
    { date: '2023.06.20', noticeTitle: '사용자 편의성 개선' },
    { date: '2023.06.20', noticeTitle: '사용자 편의성 개선' },
  ]

  console.log('noticeItem.date', noticeItem)
  return (
    <>
      <Dark>
        <PopUp>
          <CloseBtn onClick={() => {
            props.closeHandler()
          }}
            closeBtn={`${process.env.PUBLIC_URL}/image/inputDeleteBtn.webp`}
          ></CloseBtn>
          <h1>모각코 ONː 팀이 전하는 안내사항</h1>
          <h2>
            모각코 ONː 을 이용해주시는 여러분들!<br />
            모두 감사드립니다.<br />
            현재는 유저테스트 기간으로 본인이 접속한 위치가 아닌 동네에도 참여할 수 있습니다.!<br />
            여러분들이 성실히 작성해주시는 피드백은 모두 감사히 보고 있습니다.
          </h2>
          <h1>여러분의 피드백이 이렇게 반영됐어요!</h1>

          <ScrollBox>
            <ScrollWrap>
              <NoticeWrap>
                <h3>{noticeItem[0].date} {noticeItem[0].noticeTitle}</h3>
                <NoticeContent>
                  <TypeBox color={'#6DD35E'} type={'Fix'} content={'화상 채팅 화면 공유 에러 수정'}/>
                  <TypeBox color={'#6DD35E'} type={'Fix'} content={'화상 채팅 화면 공유 에러 수정'}/>
                  <TypeBox color={'#6DD35E'} type={'Fix'} content={'화상 채팅 화면 공유 에러 수정'}/>
                </NoticeContent>
              </NoticeWrap>

              <NoticeWrap>
                <h3>{noticeItem[1].date} {noticeItem[1].noticeTitle}</h3>
                <NoticeContent>
                  <TypeBox color={'#FF635D'} type={'Discard'} content={'화면 공유 기능 일시 중단'}/>
                  <TypeBox color={'#F4AA33'} type={'Change'} content={'채팅 기능 수정'}/>
                </NoticeContent>
              </NoticeWrap>

            </ScrollWrap>
          </ScrollBox>
          <DisappearBtnWrap>
            <p onClick={() => {
              props.disableHandler()
            }}>오늘 하루 보지 않기</p>
          </DisappearBtnWrap>
          <ConfirmBtn onClick={() => {
            props.closeHandler()
          }}>확인</ConfirmBtn>
        </PopUp>
      </Dark>
    </>
  )
}

export const Dark = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0,0.8);
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
`

export const PopUp = styled.div`
  position: relative;
  width: 708px;
  height: 847px;
  background: var(--bg-li);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 5px 5px 20px 0 rgba(0,0,0,0.4);
  /* justify-content: space-between; */
  padding: 63px 60px 0 60px;
  h1 {
    width: 100%;
    text-align: start;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    color: #FFFFFF;
  }

  h2 {
    width: 100%;
    height: 83px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    color: #FFFFFF;
    margin-top: 27px;
    margin-bottom: 48px;
  }

  p {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    border-bottom: 1px solid #FFFFFF;
    padding-bottom: 3px;
    cursor: pointer;
    margin-top: 22px;
    display: flex;
  }
`

export const CloseBtn = styled.button`
  width: 13px;
  height: 13px;
  position: absolute;
  top: 21px;
  right: 24px;
  font-size: 25px;
  border: none;
  background-color: transparent;
  background-image: ${(props) =>
    `url(${props.closeBtn})`
  };
  background-position: center;
  background-size:cover;
`

export const ScrollBox = styled.div`
  width: 574px;
  height: 404px;
  background: #3E4957;
  border-radius: 10px;  
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 22px;
  padding: 22px 13px 22px 0px;
  box-sizing: border-box;
`

export const ScrollWrap = styled.div`
  /* width: 574px; */
  width: 574px;
  height: 380px;
  overflow-y: scroll;
  padding-left: 33px;
  display: flex;
  flex-direction: column;
  gap: 31px;
  &::-webkit-scrollbar{
      width: 7px;
      background-color: transparent;
      border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
      /* width: 10px; */
      height: 10%; 
      background-color: white;
      border-radius: 10px;
      height: 30px;
  }

  &::-webkit-scrollbar-track {
      background-color: #626873;
      border-left: 2px solid transparent;
      border-right: 2px solid transparent;
      background-clip: padding-box;
  }
`

export const DisappearBtnWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 8px;
`

export const ConfirmBtn = styled.button`
  width: 164px;
  height: 32px;
  background-color: var(--po-de);
  border-radius: 359px;
  color: var(--ft-bk);
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  border: none;
  transition: all 0.2s;
  &:hover {
    background-color: #00C5D1;
  }
`

export const NoticeWrap = styled.div`
  width: 100%;
  height: 100px;

  h3 {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    color: #00EFFF;
  }
`

export const NoticeContent = styled.ul`
  width: 100%;
  height: 100%;
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`
export default NoticePopup