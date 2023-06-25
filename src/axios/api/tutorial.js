import { jwtInstance } from "../apiConfig";

export const checkTutorial = async () => {    
    try {
        const response = await jwtInstance.put(`/members/tutorial-check`)
        return Promise.resolve(response)
    }catch(error) {
        return Promise.reject(error)
    }
}