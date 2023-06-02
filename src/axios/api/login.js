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
    }else if (response.status === 400){
      // 잘못된 비밀번호 입니다.
      return Promise.reject(response)
    }else if (response.status === 404){
      // 찾을수 없는 회원입니다.
      return Promise.reject(response)
    }else {
      // 로그인실패
      return Promise.reject(response)
    }
  } catch (error) {
    // 로그인 실패
    console.log(error)
  }
}

export { login }