import instance from "../apiConfig"
import { setCookie } from "../../cookie/Cookie"

const login = async (loginUserInfo) => {
  try {
    const response = await instance.post('/members/login', loginUserInfo)
    if (response.status === 200 && response.data.message === '로그인 성공') {
      // 토큰 받기
      const token = response.headers["access_key"]
      setCookie("token", token)
      setCookie("nickName", response.data.data)
      return Promise.resolve(response)
    }
  } catch (error) {
    // 로그인 실패
    console.log("로그인실패 예외 처리", error.response.data.message)
    return Promise.reject(error.response.data.message)
  }
}

export { login }