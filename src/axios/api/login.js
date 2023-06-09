import instance from "../apiConfig"
import { setCookie } from "../../cookie/Cookie"

const login = async (loginUserInfo) => {
  try {
    const response = await instance.post('/members/login', loginUserInfo)
    if (response.status === 200 && response.data.message === '로그인 성공') {
      // 토큰 받기
      const token = response.headers["access_key"]
      setCookie("token", token)
      setCookie("nickName", response.data.data.nickname)
      setCookie("profileImage", response.data.data.profileImage)

      // // 로그인한 사용자의 경우 위치 정보 얻기
      // if ('geolocation' in navigator) {
      //   navigator.geolocation.getCurrentPosition(
      //     (position) => {
      //       console.log("[INFO] 로그인 완료 - 사용자의 위치정보를 받아왔습니다...")
      //       const { latitude, longitude } = position.coords
      //       // 얻은 위치를 쿠키에 저장
      //       setCookie("login_latitude", latitude)
      //       setCookie("login_longitude", longitude)
      //     },
      //     (error) => {
      //       console.log('[INFO] 로그인 완료 - 위치 정보를 가져오는데 실패했습니다. 기본위치로 조회합니다.', error)
      //     }
      //   )
      // }else{
      //   console.log('[INFO] 로그인 완료 - Geoloaction이 지원되지 않는 브라우저 입니다. 기본 조회위치로 지정합니다.')
      // }

      return Promise.resolve(response)
    }
  } catch (error) {
    // 로그인 실패
    console.log("로그인실패 예외 처리", error.response.data.message)
    return Promise.reject(error.response.data.message)
  }
}

export { login }