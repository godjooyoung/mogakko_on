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

    return requestURL
}

export const getRoomList = async (searchInfo) => {    
    try {
        const response = await instance.post(`/mogakkos`+setRequestURL(searchInfo), {lon:searchInfo.searchLongitude, lat:searchInfo.searchLatitude})
        return response.data    
    }catch(error) {
        console.log(error)
    }
}