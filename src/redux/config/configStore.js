// 예시 파일
import { configureStore, applyMiddleware } from "@reduxjs/toolkit"
import searchSlice from "../modules/search"
import userSlice from "../modules/user"
import thunk from 'redux-thunk'
const store = configureStore({
    reducer : {
        searchInfo: searchSlice,
        userInfo : userSlice,
    },
    devTools: false,
    middleware: [thunk]
})

export default store
