import { createSlice } from '@reduxjs/toolkit'
// 초기상태 설정 (사용자 위치 정보가 없을 경우 지도에 보여줄 기본 위치)
const initialState = {
    userLongitude : 37.5561332,
    userLatitude : 126.8656449,

    searchLongitude : 37.5561332,
    searchLatitude : 126.8656449,
    searchKeyword : '',
    searchLanguage : '',
}
const searchSlice = createSlice({
    name: 'searchInfo',
    initialState: initialState,
    reducers: {
        __userLocation: (state, action) => {
            const { longitude, latitude } = action.payload;
            state.userLongitude = longitude;
            state.userLatitude = latitude;
        },
        __searchLocation: (state, action) => {
            const { longitude, latitude } = action.payload;
            state.searchLongitude = longitude;
            state.searchLatitude = latitude;
        },
        __searchKeyword: (state, action) => {
            state.searchKeyword = action.payload;
        },
        __searchLanguage: (state, action) => {
            state.searchLanguage = action.payload;
        },
    }
})


export const { __userLocation, __searchLocation, __searchKeyword, __searchLanguage } = searchSlice.actions
export default searchSlice.reducer