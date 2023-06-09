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

// 친구요청 목록 조회 (누가 나한테 친구 신청 했는지..)
const getFriendRequestList = async () => {
  try {
    const response = await jwtInstance.get('/friendship/requests/pending')
    console.log("response : ", response)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

// 친구 신청 수락/거절
const reciveFriendRequest = async (target) => {
  //{"requestSenderNickname": String,"determineRequest": boolean}
  console.log("장미의 선택은..?", target)
  try {
    const response = await jwtInstance.post('/friendship/requests/determine', target)
    return response
  } catch (error) {
    console.log(error)
  }
}

// 친구 삭제
const deleteFriend = async (targetFriend) => {
  console.log("너랑 절교다!!", targetFriend)
  const target = {receiverNickname : targetFriend}
  
  try {
    const response = await jwtInstance.post('/friendship/requests/delete', target)
    return response
  } catch (error) {
    console.log(error)
  }
}

// 친구 요청
const requestFriend = async (targetFriend) => {
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
    const response = await jwtInstance.get('/members/'+memberId)
    console.log("getUserProfile response : ", response.data.message)
    console.log("getUserProfile response : ", response.data.data)
    if(response.data.message === '프로필 조회 성공'){
      return Promise.resolve(response)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

// githubID 등록
const githubIdPost = async (id) => {
  try {
    const response = await jwtInstance.post('/members/github', {'githubId':id})
    return response
  } catch (error) {
    console.log(error)
  }
}


export { getProfile, addProfile, getFriendList, getFriendRequestList, reciveFriendRequest, deleteFriend, getUserProfile, requestFriend, githubIdPost }