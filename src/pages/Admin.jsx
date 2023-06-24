import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { fetchReportedUsers,  handleReportProcessing} from '../axios/api/admin';
function Admin() {
  const [reportedUsers, setReportedUsers] = useState([]);

  const queryClient = useQueryClient()
  const { isLoading, isError, data } = useQuery("getReportUser", fetchReportedUsers)

  console.log('reportedUsersreportedUsers',data)
  return (
    <AdminWrap>
      <h1>관리자 페이지</h1>
    
    </AdminWrap>
  );
}

const AdminWrap = styled.div`
  color: #ffffff;
`;


export default Admin