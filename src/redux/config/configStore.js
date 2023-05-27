// 예시 파일
import { configureStore } from "@reduxjs/toolkit"
import userLocation from "../modules/userLocation";

const store = configureStore({
    reducer : {
        userLocation,
    },
    devTools: false
})

export default store
