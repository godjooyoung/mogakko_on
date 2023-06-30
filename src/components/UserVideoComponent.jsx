import React, { useEffect, useState } from 'react';
import OpenViduVideoComponent from './OpenViduVideo';
import { styled } from 'styled-components'
import { useMutation } from 'react-query';
import { requestFriend } from '../axios/api/mypage';

function UserVideoComponent(props) {
    const [userAudio, setUserAudio] = useState(props.streamManager.stream.audioActive)
    const [isMoreBtnOpen, setIsMoreBtnOpen] = useState(false)
    const userNickName = props.streamManager.stream.connection.data

    // 친구 신청 뮤테이션
    const friendRequestMutation = useMutation(requestFriend, {
        onSuccess: (response) => {
            if (response) {
                // 성공하면 트루로 바꿔서 스낵바 띄우기
                props.getFriendResponseMsgHandler('친구신청 완료')

            }
        },
        onError: (error) => {
            // 실패해도 스낵바 띄우기
            props.getFriendResponseMsgHandler(error.response.data.message)
        }
    })

    // 친구 신청 뮤테이션 콜 핸들러
    const friendRequestMutationCallHandler = () => {
        friendRequestMutation.mutate(userNickName)
    }

    // stream 속성의 connection.data 값을 파싱, 그 안에서 clientData 속성의 값을 반환 
    // 이 함수를 호출하면 현재 사용자의 닉네임을 가져옴.
    const getNicknameTag = () => {
        const nickName = props.streamManager.stream.connection.data
        return nickName
    }

    useEffect(() => {
        setUserAudio(props.streamManager.stream.audioActive);
    }, [props.streamManager.stream.audioActive]);

    return (
        <VideoWrap>
            {props.streamManager !== undefined ? (
                <VideoComponentWrap className="streamcomponent">
                    {/* 더보기 버튼 */}
                    {
                        props.isSelf ?
                            <>
                            </> :
                            <>
                                <VideoMore
                                    isMoreBtnOpen={isMoreBtnOpen}
                                    videoMoreBtnUrl={`${process.env.PUBLIC_URL}/image/videoMore.webp`}
                                    videoMoreBtnActiveUrl={`${process.env.PUBLIC_URL}/image/videoMoreActive.webp`}
                                    onClick={(event) => {
                                        event.stopPropagation() // 이벤트 전파 방지
                                        setIsMoreBtnOpen((prevIsMoreBtnOpen) => (!prevIsMoreBtnOpen))
                                    }}
                                />
                            </>
                    }

                    {/* 더보기 버튼 클릭시 나오는 창 */}
                    <VideoMoreSelect isMoreBtnOpen={isMoreBtnOpen}>
                        <ul>
                            <VideoMoreSelectFirstChild 
                                onClick={(event)=>{
                                    event.stopPropagation() // 이벤트 전파 방지
                                    friendRequestMutationCallHandler()
                                }}>
                                    친구 추가하기
                            </VideoMoreSelectFirstChild>
                            <VideoMoreSelectSecondChild 
                                onClick={(event) => {
                                    event.stopPropagation() // 이벤트 전파 방지
                                    props.getUserNicknameHandler(getNicknameTag())
                            }}>
                                신고하기
                            </VideoMoreSelectSecondChild>
                        </ul>
                    </VideoMoreSelect>
                    {/* 비디오 컴포넌트 */}
                    <OpenViduVideoComponent streamManager={props.streamManager} />
                    {/* 유저 닉네임 표기 */}
                    <UserNickName>
                        {getNicknameTag()} {!userAudio && <img src={`${process.env.PUBLIC_URL}/image/userMicOff.webp`} alt="마이크 음소거 아이콘" />}
                    </UserNickName>
                </VideoComponentWrap>
            ) : <div></div>}
        </VideoWrap>
    );
}

export const AbsoluteWrap = styled.div`
    position: absolute;
`
export const VideoWrap = styled.div`
/* background-color: #626873;
height: calc(100% - 10px);
border-radius: 10px; */
`

export const VideoComponentWrap = styled.div`
    position: relative;
`
export const VideoMore = styled.button`
    width: 20px;
    height: 20px;
    position: absolute;
    top : 10px;
    left: 8px;
    cursor: pointer;
    border : none;
    background-image: url(
    ${(props) => {
        return props.isMoreBtnOpen ? props.videoMoreBtnActiveUrl : props.videoMoreBtnUrl
    }});
    background-color: transparent;
    &:hover {
        background-image: url(
            ${(props) => {
        return props.videoMoreBtnActiveUrl
    }});
    }
    &:active {
        background-image: url(
            ${(props) => {
        return props.videoMoreBtnActiveUrl
    }});
    }
    z-index: 1;
`
export const VideoMoreSelect = styled.div`
    width: 98px;
    height: 50px;
    background: #3E4957;
    border-radius: 5px;
    z-index: 1;
    position: absolute;
    top : 33px;
    left: 8px;
    visibility : ${(props) => {
        return props.isMoreBtnOpen ? 'visible' : 'hidden'
    }};
`

export const VideoMoreSelectFirstChild = styled.li`
    width: 98px;
    height: 25px;
    &:hover {
        background-color: var(--bg-li)
    }
    border-top-left-radius:5px;
    border-top-right-radius:5px;
    cursor: pointer;
    color : #FFFFFF;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    padding-top: 5px;
    padding-left: 11px;
    display: flex;
    align-items: center;
`
export const VideoMoreSelectSecondChild = styled.li`
    width: 98px;
    height: 25px;
    &:hover {
        background-color: var(--bg-li)
    }
    border-bottom-left-radius:5px;
    border-bottom-right-radius:5px;
    cursor: pointer;
    color : #FF635D;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    padding-bottom: 5px;
    padding-left: 11px;
    display: flex;
    align-items: center;
`


export const UserNickName = styled.span`
    color: white;
    font-size: 12px;
    position: absolute;
    left: 0;
    bottom: 4px;
    bottom : 0px;
    background: rgba(0, 0, 0, 0.59);
    border-bottom-left-radius: 10px;
    border-top-right-radius: 10px;
    padding-top: 5px;
    padding-bottom: 3px;
    padding-inline: 10px;
`
export default UserVideoComponent