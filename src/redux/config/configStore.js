// 예시 파일
import { configureStore } from "@reduxjs/toolkit"
import searchSlice from "../modules/search"

const store = configureStore({
    reducer : {
        searchInfo: searchSlice,
    },
    devTools: false
})

export default store
