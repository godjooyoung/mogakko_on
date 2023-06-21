// axios 요청이 들어가는 모든 모듈
import axios from "axios"
import { getCookie, removeCookie, setCookie } from "../cookie/Cookie"

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

// kakao Rest API 요청 인스턴스
const kakaoInstance = axios.create({
    baseURL: process.env.REACT_APP_KAKAO_URL,
    headers: {
        Authorization: process.env.REACT_APP_KAKAO_KEY,
    }
})

// jwtInstance 요청 
jwtInstance.interceptors.request.use((config) => {
    if (config.headers === undefined) return;
    
    const token = getCookie("token")
    const headersToken = config.headers["access_key"]
    
    if(!headersToken){
        config.headers["ACCESS_KEY"] = `${token}`
    }

    config.originalUrl = config.url // 기존 요청 정보를 저장한다.
    return config;
});

// jwtInstance 응답
jwtInstance.interceptors.response.use(
    function(response){
        return response
    },
    function(error){
        // console.log("응답 인터셉트 - error 1", error)
        // console.log("응답 인터셉트 - error 2", error.config)
        // console.log("응답 인터셉트 - error 3", error.config.headers)

        if(error.response.data.message === 'AccessToken Expired.'){
            // console.log('응답 인터셉트 - AccessToken Expired.')
            const res = retryOriginalRequest(error)
            // console.log("응답 인터셉트 - 재조회 결과",res)
            return res

        }else if(error.response.data.message === 'RefreshToken Expired.'){
            // console.log('응답 인터셉트 - RefreshToken Expired.')
            // TODO 로그아웃 처리 후 로그인 페이지로 리다이렉트 시키기
            return Promise.reject(error)
        }
        
    },
)

let pendingRequest = null;

const retryOriginalRequest = async (error) => {
    if (pendingRequest) {
        return pendingRequest
    }
    const { config } = error
    const originalUrl = config.originalUrl // 기존 요청의 엔드포인트를 가져옵니다.
    if (originalUrl) {
        const token = getCookie("token")
        const refreshToken = getCookie("refreshToken")

        config.headers["ACCESS_KEY"] = `${token}`
        config.headers["REFRESH_KEY"] = `${refreshToken}`
        const response = await axios(config)
        // console.log(":: 응답 인터셉트 - 기존 요청 재 실행 완료", response)

        const newToken = response.headers["access_key"]
        const newRefreshToken = response.headers["refresh_key"]

        if (newToken) {
            // 토큰을 쿠키에 업데이트합니다.
            // console.log(":: 응답 인터셉트 - 토큰을 쿠키에 업데이트합니다.", response)
            await setCookie("token", newToken)
            await setCookie("refreshToken", newRefreshToken)
        }        
        return response

    }

}

export { jwtInstance, kakaoInstance, retryOriginalRequest }
export default instance