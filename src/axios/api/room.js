import instance from "../apiConfig"

// 요청 URL 세팅
const setRequestURL = (searchInfo) => {    
    const languageURL = searchInfo.searchLanguage?`language=${searchInfo.searchLanguage}`:''
    const keywordURL = searchInfo.searchKeyword?`searchKeyword=${searchInfo.searchKeyword}`:''
    let requestURL = ''
    
    if(languageURL){
        if(keywordURL){
            requestURL = '?'+languageURL+'&'+keywordURL
        }else{
            requestURL = '?'+languageURL
        }
    }else{
        if(keywordURL){
            requestURL = '?'+keywordURL
        }else{
            requestURL = ''
        }
    }

    console.log("요청URL", requestURL)
    return requestURL
}

export const getRoomList = async (searchInfo) => {    
    try {
        const response = await instance.post(`/mogakko`+setRequestURL(searchInfo), {lon:searchInfo.searchLongitude, lat:searchInfo.searchLatitude})
        return response.data
    }catch(error) {
        console.log(error)
    }
}


// // 단건 조회
// export const getPost = async (id) => {
//     const response = await api.get(`/posts/`+id)
//     return response.data
// }

// // 등록
// export const addPost = async (inputValue) => {
//     await api.post(`/posts/`, inputValue)
// }

// // 삭제
// export const deletePost = async (id) => {
//     await api.delete(`/posts/`+id)
// }

// // 수정
// export const updatePost = async (target) => {
//     await api.patch(`/posts/`+target.id, target.modifyedPost)
// }