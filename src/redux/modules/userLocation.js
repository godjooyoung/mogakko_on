// 예시파일
import {createSlice} from '@reduxjs/toolkit'
// 초기상태 설정
const initialState = {
    longitude : 37.5561332,
    latitude : 126.8656449,
}
const userLocationSlice = createSlice({
    name: 'userLocation',
    initialState: initialState,
    reducers: {
        userLocationInfo: (state, payload) => {
            state = payload.payload
        },
    }
})


export const { userLocationInfo } = userLocationSlice.actions
export default userLocationSlice.reducer