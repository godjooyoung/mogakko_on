import { jwtInstance } from "../apiConfig";

const leaveChatRoom = async (sessionId) => {
  // console.log("[INFO] leaveChatRoom" , sessionId)
  try {
    const response = await jwtInstance.delete(`/mogakko/${sessionId}`)
    return response
  } catch (error) {
    console.log(error)
  }
}

const recordTimer = async (diffTime) => {
  // console.log("[INFO] recordTimer" , diffTime)
  const objDiffTime = { "mogakkoTimer" : diffTime }
  try {
    const response = await jwtInstance.put(`/mogakko/timer`, objDiffTime)
    return response
  } catch (error) {
    console.log(error)
  }
}

export { leaveChatRoom,  recordTimer}