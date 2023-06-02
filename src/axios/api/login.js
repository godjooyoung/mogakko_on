import instance from "../apiConfig"
import { setCookie } from "../../cookie/Cookie"

const login = async (loginUserInfo) => {
  try {
    const response = await instance.post('/members/login', loginUserInfo)
    if (response.status === 200 && response.data.message === '로그인 성공') {
      // 토큰 받기
      const token = response.headers["access_key"]
      setCookie("token", token)
      return Promise.resolve(response)
    }
  } catch (error) {
    console.log(error)
  }
}

export { login }