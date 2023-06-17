import instance from "../apiConfig"

export const getBestMember = async () => {    
    try {
        const response = await instance.get(`/members/best`)
        if (response.status === 200 && response.data.message === '최고의 ON:s 조회 성공') {
            // console.log("최고의 멤버 조회~~~> 1.", response)
            // console.log("최고의 멤버 조회~~~> 2.", response.data)
            // console.log("최고의 멤버 조회~~~> 3.", response.data.data)
            return Promise.resolve(response.data.data)
        }else {
            return Promise.reject(response)
        }  
    }catch(error) {
        console.log(error)
    }
}
