import { createSlice } from '@reduxjs/toolkit'
// 초기상태 설정 (사용자 위치 정보가 없을 경우 지도에 보여줄 기본 위치)
const initialState = {
    searchLatitude : 37.5561332,
    searchLongitude : 126.8656449,
    searchKeyword : '',
    searchLanguage : '',
}
const searchSlice = createSlice({
    name: 'searchInfo',
    initialState: initialState,
    reducers: {
        __searchLocation: (state, action) => {
            const { latitude, longitude } = action.payload;
            state.searchLatitude = latitude;
            state.searchLongitude = longitude;
        },
        __searchKeyword: (state, action) => {
            state.searchKeyword = action.payload;
        },
        __searchLanguage: (state, action) => {
            state.searchLanguage = action.payload;
        },
    }
})


export const { __searchLocation, __searchKeyword, __searchLanguage } = searchSlice.actions
export default searchSlice.reducer