import { createSlice } from '@reduxjs/toolkit'
import { useQuery } from 'react-query';
import { getAddress } from '../../axios/api/kakao'
import { useDispatch, useSelector } from 'react-redux';

// 초기상태 설정 (사용자 위치 정보가 없을 경우 지도에 보여줄 기본 위치)
const initialState = {
    userLatitude: 37.5561332,
    userLongitude: 126.8656449,
    userTown: '서울특별시 강서구 염창동',
}
const userSlice = createSlice({
    name: 'userInfo',
    initialState: initialState,
    reducers: {
        __userLocation: (state, action) => {
            const { latitude, longitude } = action.payload;
            state.userLatitude = latitude;
            state.userLongitude = longitude;
        },
        __userTown: (state, action) => {
            state.userTown = action.payload;
        },
    }
})

export const fetchUserLocation = (userLocation) => async (dispatch) => {
    try {
        // 좌표 to 주소 GET 요청
        const response = await getAddress({
            x: userLocation.longitude,
            y: userLocation.latitude,
        });
        // 액션 디스패치
        dispatch(__userLocation({ latitude: userLocation.latitude, longitude: userLocation.longitude }));
        dispatch(__userTown(response.documents[0].address_name));
    } catch (error) {
        // 에러 처리
        console.log('API 요청 에러:', error);
    }
};


export const { __userLocation, __userTown } = userSlice.actions
export default userSlice.reducer