import { kakaoInstance } from '../apiConfig'

export const getLatLng = async (adress) => {
    console.log("adress : ", adress)

    const response = await kakaoInstance.get('/v2/local/search/address.json', {
        params: {
            query: adress
        }
    })
    console.log("response : ", response)

    return response.data
}
