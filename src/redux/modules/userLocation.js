// 사용안함 삭제 해아함, sjy
import { createSlice } from '@reduxjs/toolkit'
// 초기상태 설정 (사용자 위치 정보가 없을 경우 지도에 보여줄 기본 위치)
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