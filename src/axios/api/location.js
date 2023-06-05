import instance from "../apiConfig"

// 인기동네 목록 조회
export const getHotTowns = async () => {
    try {
        const response = await instance.get('/mogakko/read')
        if (response.status === 200 && response.data.message === '인기 지역 모각코 조회 성공') {
            return Promise.resolve(response.data.data)
        }else {
            // 인기동네 조회 실패
            return Promise.reject(response)
        }
    } catch (error) {
        return Promise.reject(error)
    }
}