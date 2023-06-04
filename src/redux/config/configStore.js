import { configureStore, applyMiddleware } from "@reduxjs/toolkit"
import searchSlice from "../modules/search"
import userSlice from "../modules/user"
import alarmSlice from "../modules/alarm"
import thunk from 'redux-thunk'

const store = configureStore({
    reducer : {
        searchInfo: searchSlice,
        userInfo : userSlice,
        alarmInfo : alarmSlice,
    },
    devTools: false,
    middleware: [thunk]
})

export default store
