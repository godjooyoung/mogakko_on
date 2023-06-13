import { jwtInstance } from "../apiConfig";

//쪽지보내기
const sendMessage = async (message) => {
  try {
    const response = await jwtInstance.post(`/directMessage/send`)
    return response
  } catch (error) {
    console.log(error)
  }
}

//받은 쪽지 조회
const receivedMessage = async () => {
  try {
    const response = await jwtInstance.get('/directMessage/received')
    return response
  } catch (error) {
    console.log(error)
  }
}

//보낸 쪽지 조회
const sentMessage = async () => {
  try{
    const response = await jwtInstance.get('/directMessage/sent')
    return response
  } catch (error) {
    console.log(error)
  }
}

export { sendMessage, receivedMessage, sentMessage }