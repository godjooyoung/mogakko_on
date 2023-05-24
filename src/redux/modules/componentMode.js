// 예시파일
import {createSlice} from '@reduxjs/toolkit'
// 초기상태 설정
const initialState = {
    registerIsActive : false,
    postIsEditMode : false,
    pwConfirmIsActive : false,
}
const componentModeSlice = createSlice({
    name: 'componentMode',
    initialState: initialState,
    reducers: {
        registerIsActive: (state, payload) => {
            state.registerIsActive = payload.payload
        },
        postIsEditMode: (state, payload) => {
            state.postIsEditMode = payload.payload
        },
        pwConfirmIsActive: (state, payload) => {
            state.pwConfirmIsActive = payload.payload
        }
    }
})


export const { registerIsActive, postIsEditMode, pwConfirmIsActive } = componentModeSlice.actions
export default componentModeSlice.reducer