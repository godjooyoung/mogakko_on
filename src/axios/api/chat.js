import { jwtInstance } from "../apiConfig";

const leaveSession = async (sessionId) => {
  try {
    const response = await jwtInstance.delete(`/mogakko/${sessionId}`)
    return response
  } catch (error) {
    console.log(error)
  }
}

export {leaveSession}