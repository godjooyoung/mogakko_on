import { jwtInstance } from "../apiConfig";

// 프로필 조회
const getProfile = async () => {
  try {
    const response = await jwtInstance.get('/members/mypage')
    console.log("response : ", response)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

// 프로필 수정
const addProfile = async (file) => {
  try {
    const response = await jwtInstance.put('/members/mypage', file)
    return response
  } catch (error) {
    console.log(error)
  }
}

export {getProfile, addProfile}