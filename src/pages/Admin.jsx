import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import jwtInstance from '../axios/apiConfig';

function Admin() {
  const [reportedUsers, setReportedUsers] = useState([]);

  useEffect(() => {
    fetchReportedUsers();
  }, []);

  const fetchReportedUsers = async () => {
    try {
      const response = await jwtInstance.get('/members/admin');
      const { data } = response;
      setReportedUsers(data);
    } catch (error) {
      // Handle error
    }
  };

  const handleReportProcessing = async (declaredMemberId) => {
    try {
      const response = await jwtInstance.post(`/members/admin/${declaredMemberId}`);
      // Handle successful report processing
    } catch (error) {
      // Handle error
    }
  };

  return (
    <AdminWrap>
      <h1>관리자 페이지</h1>
      <ReportedUserList>
        {reportedUsers.map((user) => (
          <ReportedUser key={user.id}>
            <div>
              <span>신고된 닉네임: {user.reportedNickname}</span>
              <span>신고 이유: {user.reason}</span>
              <span>신고 처리 상태: {user.declaredMember.memberStatusCode}</span>
            </div>
            {!user.declaredMember.declared && (
              <button onClick={() => handleReportProcessing(user.declaredMember.id)}>
                신고 처리
              </button>
            )}
          </ReportedUser>
        ))}
      </ReportedUserList>
    </AdminWrap>
  );
}

const AdminWrap = styled.div`
  color: #ffffff;
`;

const ReportedUserList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReportedUser = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  button {
    background-color: #ffffff;
    color: #000000;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
  }
`;

export default Admin