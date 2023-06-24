import React, { useState } from 'react'
import styled from 'styled-components'
import useInput from '../../hooks/useInput';
import { reportUser } from '../../axios/api/report';
import { useMutation } from 'react-query';
function ReportPopup(props) {
  const [selectedCause, setSelectedCause] = useState(null);
  const [reportReason, setReportReason] = useState(null)
  const [reasonValue, onChangeReasonValue, reasonValueReset] = useInput('')
  const [reportMsg, setReportMsg] = useState(null)

  const CheckboxChangehandler = (event) => {
    const { id, checked } = event.target;
    if (checked) {
      setSelectedCause(id);
      reportReasonHandler(id)
    } else {
      setSelectedCause(null);
      setReportReason(null)
    }
  };

  const reportReasonHandler = (id) => {
    if (id === "commercial") {
      setReportReason("상업적/홍보성")
    } else if (id === "obscene") {
      setReportReason("음란/선정성")
    } else if (id === "illegality") {
      setReportReason("불법정보")
    } else if (id === "abuse") {
      setReportReason("욕설/인신공격")
    } else if (id === "individual") {
      setReportReason("개인정보노출")
    } else if (id === "ETC") {
      setReportReason("기타")
    }
  }
  
  // 신고 뮤테이션
  const reportMutation = useMutation(reportUser, {
    onSuccess: (response) => {
      // setReportMsg('신고가 접수되었습니다.')
      console.log('responseresponse',response)
      props.reportMsgHandler('신고가 접수되었습니다.')
    },
    onError: (error) => {
      console.log('errorerror',error.response.data.message)
      props.reportMsgHandler(error.response.data.message)
    }
  })

  const reportHandler = (nickname, cause, inputValue) => {
    const report = {
      declaredNickname : nickname,
      declaredReason : cause ,
      reason: inputValue
    }
    reportMutation.mutate(report)
  }
  return (
    <>
      <Dark>
        <ReportWrap>
          <h1>신고하기</h1>
          <ReportCauseWrap>
            <ReportCauseBox>
              <ReportCause>
                <InputCheckbox
                  type="checkbox"
                  id='commercial'
                  checked={selectedCause === "commercial"}
                  onChange={CheckboxChangehandler} />
                <label htmlFor="commercial">상업적/홍보성</label>
              </ReportCause>
              <ReportCause>
                <InputCheckbox
                  type="checkbox"
                  id='obscene'
                  checked={selectedCause === "obscene"}
                  onChange={CheckboxChangehandler}
                />
                <label htmlFor="obscene">음란/선정성</label>
              </ReportCause>
            </ReportCauseBox>

            <ReportCauseBox>
              <ReportCause>
                <InputCheckbox
                  type="checkbox"
                  id='illegality'
                  checked={selectedCause === "illegality"}
                  onChange={CheckboxChangehandler}
                />
                <label htmlFor="illegality">불법정보</label>
              </ReportCause>
              <ReportCause>
                <InputCheckbox
                  type="checkbox"
                  id='abuse'
                  checked={selectedCause === "abuse"}
                  onChange={CheckboxChangehandler}
                />
                <label htmlFor="abuse">욕설/인신공격</label>
              </ReportCause>
            </ReportCauseBox>

            <ReportCauseBox>
              <ReportCause>
                <InputCheckbox
                  type="checkbox"
                  id='individual'
                  checked={selectedCause === "individual"}
                  onChange={CheckboxChangehandler}
                />
                <label htmlFor="individual">개인정보노출</label>
              </ReportCause>
              <ReportCause>
                <InputCheckbox
                  type="checkbox"
                  id='ETC'
                  checked={selectedCause === "ETC"}
                  onChange={CheckboxChangehandler}
                />
                <label htmlFor="ETC">기타</label>
              </ReportCause>
            </ReportCauseBox>
          </ReportCauseWrap>

          <h2>신고 사유</h2>
          <ReportInput type="text" value={reasonValue} onChange={(e) => { onChangeReasonValue(e) }} placeholder={reportReason === '기타' ? '기타는 신고 사유 입력이 필수입니다.' : '신고 사유를 입력해주세요.'}/>
          <BtnWrap>
            <ReportBtn color={'#FF635D'} onClick={() => {
              reportHandler(props.nickname, reportReason, reasonValue)
              props.closeHander()
            }}>신고하기</ReportBtn>
            <ReportBtn onClick={() => {
              props.closeHander()
            }}>취소</ReportBtn>
          </BtnWrap>
        </ReportWrap>
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

export const ReportWrap = styled.div`
  width: 332px;
  height: 416px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  background: var(--bg-li);
  padding-inline: 50px;
  h1 {
      font-size: 20px;
      font-family: Pretendard;
      font-weight: 700;
      color: #FF635D;
      margin-top: 34px;
    }
  h2 {
    width: 100%;
    font-size: 15px;
    font-family: Pretendard;
    font-weight: 500;
    color: #FFFFFF;
    text-align: start;
    margin-top: 33px;
    margin-bottom: 11px;
  }
`

export const ReportCauseWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 35px;
  gap: 19px;
`

export const ReportCauseBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
`

export const ReportCause = styled.div`
  width: 115px;
  height: 18px;
  label {
    font-size: 15px;
    font-family: Pretendard;
    font-weight: 500;
    color: #FFFFFF;
    margin-left: 6px;
  }
`

export const InputCheckbox = styled.input`
    width: 14px;
    height: 14px;
    position: absolute;
    opacity: 0;
    z-index: -1;
    
    & + label {
        position: relative;
        padding-left: 26px;
        cursor: pointer;
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 2px;
            width: 14px;
            height: 14px;
            border: 1px solid #FFFFFF;
            border-radius: 2px;
            background: transparent;
            transition: all 0.3s;
        }

        &::after {
            content: '';
            position: absolute;
            left: 4px;
            top: -1px;
            width: 10px;
            height: 10px;
            border: solid white;
            /* border-width: 0 2px 2px 0; */
            /* transform: rotate(45deg);
            transform: scaleX(-1); */
            opacity: 0;
            transition: all 0.3s;
            display:none;
            background-position: center;
            background-repeat: no-repeat;
            background-image: ${(props) =>
    `url(${process.env.PUBLIC_URL}/image/termsCheck.webp)`
  };
        }
    }
    
    &:checked + label::before {
        border: none;
        background: #FF635D;
        background-position: center;
        background-repeat: no-repeat;
        background-image: ${(props) =>
    `url(${process.env.PUBLIC_URL}/image/termsCheck.webp)`
  };
    }

    &:checked + label::after {
        opacity: 1;
    }
`;


export const ReportInput = styled.textarea`
  width: 100%;
  height: 76px;
  background-color: #3E4957;
  padding: 9px 1px 10px 17px;
  border-radius: 10px;
  outline: none;
  border: none;
  font-size: 12px;
  font-family: Pretendard;
  font-weight: 500;
  line-height: 19px;
  resize: none;
  color: #BEBEBE;
  overflow-y: scroll;
  margin-bottom: 34px;
  &::-webkit-scrollbar{
      width: 7px;
      background-color: transparent;
      border-radius: 8px;
  }
`

export const BtnWrap = styled.div`
  display: flex;
  gap: 11px;
`

export const ReportBtn = styled.button`
  border-radius: 359px;
  font-size: 15px;
  font-family: Pretendard;
  font-weight: 700;
  outline: none;
  border: none;
  background-color: ${(props) => {
    return props.color === '#FF635D' ? '#FF635D' : '#E2E2E2'
  }};
  padding-block: 7px;
  padding-inline: ${(props) => {
    return props.color === '#FF635D' ? '29px' : '42px'
  }};
  color: ${(props) => {
    return props.color === '#FF635D' ? '#FFFFFF' : '#464646'
  }};
`
export default ReportPopup