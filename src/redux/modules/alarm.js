import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const alarmSlice = createSlice({
    name: 'alarmInfo',
    initialState: initialState,
    reducers: {
        __alarmSender: (state, action) => {
            // console.log("[INFO] SSE 기존 알람", state.pop())
            state = state.push(action.payload);
        },
        __alarmClean: (state, action) => {
            // console.log("[INFO] SSE clearn 전역")
            state = initialState;
        }
    }
})


export const { __alarmSender, __alarmClean } = alarmSlice.actions
export default alarmSlice.reducer