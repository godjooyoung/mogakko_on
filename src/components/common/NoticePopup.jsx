import React from 'react'
import styled from 'styled-components'
import TypeBox from './TypeBox'
function NoticePopup(props) {

  const notices = [
    {
      date: '2023.06.19',
      noticeTitle: '사용자 편의성 개선',
      noticeContents: [
        {
          color : '#6DD35E',
          type: 'Fix',
          content: '실시간 알림 랜더링 이슈'
        },
        {
          color : '#6DD35E',
          type: 'Fix',
          content: '한글 채팅 입력 시 마지막 자모 두번 입력되는 이슈'
        },
        {
          color : '#FF635D',
          type: 'Discard',
          content: '친구 프로필에서 친구 요청 후 메인 이동 기능'
        },
        {
          color : '#F4AA33',
          type: 'Change',
          content: `마이페이지 편의성 개선 - '깃허브 닉네임'으로 표기 변경`
        },
      ]
    },
    {
      date: '2023.06.20',
      noticeTitle: '사용자 편의성 개선 및 신규기능',
      noticeContents: [
        {
          color : '#FF635D',
          type: 'Discard',
          content: '회원가입 유효성 완화 - 특수문자 제외'
        },
        {
          color : '#F4AA33',
          type: 'Change',
          content: '메인 검색 속도 개선'
        },
        {
          color : '#F4AA33',
          type: 'Change',
          content: '공지 팝업 추가'
        },
        {
          color : '#F4AA33',
          type: 'Change',
          content: '쪽지 기능 개선 - 글자수 제한, 쪽지 팝업 유지'
        },
        {
          color : '#F4AA33',
          type: 'Change',
          content: '유저 검색 기능 개선 - 검색 성능 향상 및 친구신청 대기 상태 표시'
        },
        {
          color : '#F4AA33',
          type: 'Change',
          content: '방 생성 기능 개선'
        },
      ]
    }
  ]


  // console.log('noticeItem.date', noticeItem)
  return (
    <>
      <Dark>
        <PopUp>
          <CloseBtn onClick={() => {
            props.closeHandler()
          }}
            closeBtn={`${process.env.PUBLIC_URL}/image/inputDeleteBtn.webp`}
          ></CloseBtn>
          <h1>모각코 ONː팀이 전하는 안내사항</h1>
          <h2>
            안녕하세요. <b>모각코 ONː</b>을 이용해주시는 여러분들.<br />
            <b>모각코 ONː</b>은 위치기반 서비스를 지향하므로 접속된 위치 기반 12KM 내의 유저들과 함께 이용 가능합니다.<br />
            유저테스트 기간 동안은 본인의 접속 위치가 아닌 동네에서도 모각코를 생성하거나 참여할 수 있습니다.<br />
            여러분들이 성실히 작성해주시는 피드백은 모두 감사히 보고 있습니다. <br />
            - 모각코 ONː팀 드림
          </h2>
          <h1>여러분의 피드백이 이렇게 반영됐어요!</h1>

          <ScrollBox>
            <ScrollWrap>
              {notices&&notices.reverse().map((noticeItem, idx) => {
                return (
                    <NoticeWrap>
                      <NoticeContent>
                        <h3>{noticeItem.date} {noticeItem.noticeTitle}</h3>
                        {noticeItem&&noticeItem.noticeContents.map((noti) => {
                          return (
                            <TypeBox color={noti.color} type={noti.type} content={noti.content}/>
                          )
                        })}
                      </NoticeContent>
                    </NoticeWrap>
                )
              })}
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
    line-height: 170%;
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
  /* width: 574px; */
  width: 588px;
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
  width: 588px;
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

  margin-top: 22px;
  margin-bottom: 22px;
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
  
  display: flex;
  flex-direction: column;
  flex-basis: fit-content;

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
  flex-basis: fit-content;
  h3 {
    margin-bottom: 13px;
  }

`
export default NoticePopup