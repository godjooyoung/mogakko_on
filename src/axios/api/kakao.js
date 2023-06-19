import { kakaoInstance } from '../apiConfig'

// 주소 to 좌표
export const getLatLng = async (adress) => {
    // console.log("address : ", adress)

    const response = await kakaoInstance.get('/v2/local/search/address.json', {
        params: {
            query: adress
        }
    })
    // console.log("response : ", response)

    return response.data
}

// 좌표 to 주소
export const getAddress = async (coord) => {
    const response = await kakaoInstance.get(`/v2/local/geo/coord2regioncode.json?x=${coord.x}&y=${coord.y}`)
    return response.data
}