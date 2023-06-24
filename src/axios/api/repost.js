import { jwtInstance } from "../apiConfig"

const reportUser = async (report) => {
  //{"requestSenderNickname": String,"determineRequest": boolean}
  // console.log("장미의 선택은..?", target)
  try {
    const response = await jwtInstance.post('/members/declare', report)
    return response
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

export { reportUser }