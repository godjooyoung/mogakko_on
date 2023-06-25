import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { fetchReportedUsers, handleReportProcessing } from '../axios/api/admin';
function Admin() {
  const [reportedUsers, setReportedUsers] = useState([]);

  const queryClient = useQueryClient()
  const { isLoading, isError, data } = useQuery("getReportUser", fetchReportedUsers)

  const reportAllowMutation = useMutation(handleReportProcessing, {
    onSuccess: (response) => {
      queryClient.invalidateQueries(fetchReportedUsers)
    }
  })

  const reportAllowHandler = (nickname) => {
    reportAllowMutation.mutate(nickname)
  }
  return (
    <FlexBox>
      <AdminWrap>
        <h1>관리자 페이지</h1>
        <ReportTypeContainer>
          <ReportTypeWrap>
            <p>신고 회원</p>
            <p>신고 대상</p>
            <p>신고 유형</p>
            <p>신고 상세내용</p>
          </ReportTypeWrap>
          <p>신고 접수 일자</p>
        </ReportTypeContainer>

        <ScrollBox>
          <ScrollWrap>
            {
              data && data?.data?.data?.map((e, idx) => {
                return (
                  <ReportItem key={idx}>
                    <ReportCotentWrap>
                      <span>{e.reporterNickname}</span>
                      <span>{e.declaredMember.nickname}</span>
                      <span>{e.declaredReason}</span>
                      <p>{e.reason}</p>
                    </ReportCotentWrap>
                    <ReportTime>{e.declaredMember.createdAt}</ReportTime>
                    <button onClick={() => reportAllowHandler(e.declaredMember.nickname)}>승인</button>
                  </ReportItem>
                )
              })
            }
          </ScrollWrap>
        </ScrollBox>
      </AdminWrap>
    </FlexBox>
  );
}

export const FlexBox = styled.div`
  display:flex;
  justify-content: center;
  height: calc(100vh - 79px);
`

export const AdminWrap = styled.div`
  width: 100%;
  padding: 39px 33px 0px 102px;
  h1 {
    font-size: 29px;
    font-family: Pretendard;
    font-weight: 500;
    color: #FFFFFF;
  }
`;

export const ReportTypeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 15px;
  padding-right: 220px;
  p {
    font-size: 17px;
    font-family: Pretendard;
    font-weight: 500;
    color: #FFFFFF;
  }
`

export const ReportTypeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`

export const ScrollBox = styled.div`
  width: 1065px;
  height: 650px;
  border-radius: 10px;  
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

export const ScrollWrap = styled.div`
  /* width: 574px; */
  width: 1032px;
  height: 650px;
  overflow-y: scroll;
  overflow-x: hidden;
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

export const ReportItem = styled.div`
  width: 996px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 20px;

  span {
    width: 78px;
    height: 31px;
    font-size: 13px;
    font-family: Pretendard;
    font-weight: 500;
    color: #FFFFFF;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  p {
    width: 384px;
    height: 45px;
    font-size: 13px;
    font-family: Pretendard;
    font-weight: 500;
    line-height: 18.465px;
    color: #FFFFFF;
    display: flex;
    align-items: center;
  }

  button {
    width: 49.444px;
    height: 23.771px;
    text-align: center;
    font-size: 11px;
    font-family: Pretendard;
    font-weight: 700;
    color: #FFFFFF;
    border-radius: 13.312px;
    background-color: #626873;
    border: none;
  }
`

export const ReportCotentWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const ReportTime = styled.div`
  width: 180px;
  height: 31px;
  font-size: 13px;
  font-family: Pretendard;
  font-weight: 500;
  color: #BEBEBE;
  margin-left: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
`
export default Admin