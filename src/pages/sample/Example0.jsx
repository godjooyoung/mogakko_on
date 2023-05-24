// 리덕스 툴킷 사용 예시 입니다. (sjy)
import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { postIsEditMode, pwConfirmIsActive, registerIsActive } from '../../redux/modules/componentMode';

function Example(props) {

    // 1. 전역 상태 액션 함수 호출을 위한 디스패쳐 선언
    const dispatcher = useDispatch()

    // 2. 전역 상태 변경
    const onClickExampleHandler = () => {
        dispatcher(registerIsActive(true))
        dispatcher(pwConfirmIsActive(true))
        dispatcher(postIsEditMode(true))
    }

    // 3. 전역 상태 호출을 위한 useSelector 선언
    const isActive = useSelector((state)=>{
        return state.componentMode.registerIsActive
    })

    return (
        <div>
            <div>샘플 0 - 리덕스 툴킷 전역 상태 예시 페이지 입니다.</div>
            <div>현재 전역상태는 {isActive?<>참입니다</>:<>거짓입니다.</>}</div>
            <button onClick={onClickExampleHandler} type="button" class="text-white bg-blue-700 text-sm px-5 py-2.5 mr-2 mb-2 rounded-lg" > 전역 상태 값 변경 예시 버튼</button>
        </div>
    );
}

export default Example;