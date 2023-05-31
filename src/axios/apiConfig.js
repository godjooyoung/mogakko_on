// axios 요청이 들어가는 모든 모듈
import axios from "axios"
import { getCookie } from "../cookie/Cookie"

// 인스턴스
const instance = axios.create({
    baseURL : process.env.REACT_APP_SERVER_URL
})

// jwt 토큰 인스턴스
const jwtInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {

    }
})

// TODO access 키 환경변수로 빼기
// kakao Rest API 요청 인스턴스
const kakaoInstance = axios.create({
    baseURL: 'https://dapi.kakao.com',
    headers: {
        Authorization: 'KakaoAK 8d6d42d254e7524f2e1627ab38d27a6e',
    }
})

// JYS TODO 토큰 처리해주기
/* 응답 */
jwtInstance.interceptors.response.use(
    function(response){
        return response
    },
    function(error){
        return Promise.reject(error)
    },
)

/* 요청 */
jwtInstance.interceptors.request.use(
    function(config){
        return config
    },
    function(error){
        return Promise.reject(error)
    },
)

export { jwtInstance, kakaoInstance }
export default instance