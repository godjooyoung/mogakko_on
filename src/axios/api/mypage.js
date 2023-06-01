import axios from "axios";
import { jwtInstance } from "../apiConfig";
const addprofile = async (file) => {
  try {
    const response = await jwtInstance.put('/members/mypage', file)
    return response
  } catch (error) {
    console.log(error)
  }
}

export {addprofile}