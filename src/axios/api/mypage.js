import { jwtInstance } from "../apiConfig";
import instance from "../apiConfig";

// 프로필 조회
const getProfile = async () => {
  try {
    const response = await jwtInstance.get('/members/mypage')
    console.log("response : ", response)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

// 프로필 수정
const addProfile = async (file) => {
  try {
    const response = await jwtInstance.put('/members/mypage', file)
    return response
  } catch (error) {
    console.log(error)
  }
}

// 친구 목록 조회
const getFriendList = async () => {
  try {
    const response = await jwtInstance.get('/friendship/requests/accepted')
    console.log("response : ", response)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

// 친구요청 목록 조회
const getFriendRequestList = async () => {
  try {
    const response = await jwtInstance.get('/friendship/requests/pending')
    console.log("response : ", response)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

// 친구 수락
const reciveFriendRequest = async (targetFriend) => {
  //{"requestSenderNickname": String,"determineRequest": boolean}
  const target = {requestSenderNickname : targetFriend, determineRequest:true}
  try {
    const response = await jwtInstance.post('/friendship/requests/determine', target)
    return response
  } catch (error) {
    console.log(error)
  }
}

// 친구 삭제
const deleteFriend = async (targetFriend) => {
  //{”receiverNickname” : String}
  const target = {receiverNickname : targetFriend}
  try {
    const response = await jwtInstance.delete('/friendship/requests/delete', target)
    return response
  } catch (error) {
    console.log(error)
  }
}

// 친구 요청
const requestFriend = async (targetFriend) => {
  //{”receiverNickname” : String}
  console.log("친구 요청 보내기. ("+targetFriend+") 아 나랑 친구할래?")
  const target = {requestReceiverNickname : targetFriend}
  try {
    const response = await jwtInstance.post('/friendship/requests', target)
    console.log("requestFriend response : ", response.data.message)
    console.log("requestFriend response : ", response.data.data)
    return response
  } catch (error) {
    console.log(error)
  }
}

// 유저 프로필 조회
const getUserProfile = async (memberId) => {
  try {
    const response = await instance.get('/members/'+memberId)
    console.log("getUserProfile response : ", response.data.message)
    console.log("getUserProfile response : ", response.data.data)
    if(response.data.message === '프로필 조회 성공'){
      return Promise.resolve(response)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

export { getProfile, addProfile, getFriendList, getFriendRequestList, reciveFriendRequest, deleteFriend, getUserProfile, requestFriend }