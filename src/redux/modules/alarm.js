import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const alarmSlice = createSlice({
    name: 'alarmInfo',
    initialState: initialState,
    reducers: {
        __alarmSender: (state, action) => {
            state = state.push(action.payload);
        }
    }
})


export const { __alarmSender } = alarmSlice.actions
export default alarmSlice.reducer