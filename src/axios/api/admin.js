import { jwtInstance } from "../apiConfig"

// 신고된 유저 조회
const fetchReportedUsers = async () => {
  try {
    const response = await jwtInstance.get('/members/admin')
    console.log('response',response)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
};

// 신고 승인 api
const handleReportProcessing = async (declaredMemberId) => {
  try {
    const response = await jwtInstance.put(`/members/admin/ok/${declaredMemberId}`);
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
};

export { fetchReportedUsers, handleReportProcessing }