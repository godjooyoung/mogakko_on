// 예시 파일
import { configureStore } from "@reduxjs/toolkit"
import componentMode from "../modules/componentMode";

const store = configureStore({
    reducer : {
        componentMode
    },
    devTools: false
})

export default store
