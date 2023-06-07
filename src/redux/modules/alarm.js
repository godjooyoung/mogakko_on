import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const alarmSlice = createSlice({
    name: 'alarmInfo',
    initialState: initialState,
    reducers: {
        __alarmSender: (state, action) => {
            state = state.push(action.payload);
        },
        __alarmClean: (state, action) => {
            state = initialState;
        }
    }
})


export const { __alarmSender, __alarmClean } = alarmSlice.actions
export default alarmSlice.reducer