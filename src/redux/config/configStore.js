// 예시 파일
import { configureStore } from "@reduxjs/toolkit"
import componentMode from "../modules/componentMode";
import userLocation from "../modules/userLocation";

const store = configureStore({
    reducer : {
        componentMode,
        userLocation
    },
    devTools: false
})

export default store
