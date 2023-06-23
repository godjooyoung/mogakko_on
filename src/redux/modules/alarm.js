import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const alarmSlice = createSlice({
    name: 'alarmInfo',
    initialState: initialState,
    reducers: {
        __alarmSender: (state, action) => {
            console.log("[INFO] SSE 새로운 알람은 >> ", action.payload)    
            return state.concat(action.payload)
        },
        __alarmClean: (state, action) => {
            console.log("[INFO] SSE clearn 전역")
            return initialState;
        }
    }
})


export const { __alarmSender, __alarmClean } = alarmSlice.actions
export default alarmSlice.reducer