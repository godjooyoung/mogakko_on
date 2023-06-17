import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'
import { useQuery, useQueryClient } from 'react-query'
import { getLatLng } from '../axios/api/kakao'
import { getHotTowns } from '../axios/api/location'
import { fetchUserLocation } from '../redux/modules/user'
import { __searchLocation, __searchLanguage, __searchKeyword } from '../redux/modules/search'
import useInput from '../hooks/useInput'

// 메인화면 검색창 영역
function MainSearch(props) {

    const dispatcher = useDispatch()
    
    // 리액트 쿼리
    const queryClient = useQueryClient()

    // 주소 -> 좌표값 변환 api call
    const [isTargeting, setIsTargeting] = useState(false)
    const [targetAddress, setTargetAddress] = useState(null)
    const getLatLngQuery = useQuery(['getLatLng', getLatLng], () => getLatLng(targetAddress), {
        enabled: isTargeting
    })

    // 인기동네 목록
    const [townList, setTownList] = useState([
        {count: 14, neighborhood: '서울특별시 강서구 염창동', isSelected:false},
        {count: 12, neighborhood: '서울특별시 영등포구 문래동', isSelected:false},
        {count: 11, neighborhood: '서울특별시 관악구 신림동', isSelected:false},
        {count: 11, neighborhood: '서울특별시 강남구 역삼동', isSelected:false}
    ])

    // 인기 동네 목록 조회
    const { isLoading, isError, data } = useQuery("getHotTowns", getHotTowns)
    
    useEffect(()=>{
        // console.log("getHotTowns 조회결과 ", data)
        if(!data || data.length === 0){
            setTownList([
                {count: 14, neighborhood: '서울특별시 강서구 염창동', isSelected:false},
                {count: 12, neighborhood: '서울특별시 영등포구 문래동', isSelected:false},
                {count: 11, neighborhood: '서울특별시 관악구 신림동', isSelected:false},
                {count: 11, neighborhood: '서울특별시 강남구 역삼동', isSelected:false},
            ])
        }else{
            const updatedData = data.map(obj => ({ ...obj, isSelected: false }))
            setTownList(updatedData)
        }
    },[data])

    const [languageList, setLanguageList] = useState(
        [
            { desc:'전체', language : '', isSelected : true },
            { desc:'JAVA', language : 'JAVA', isSelected : false },
            { desc:'JAVASCRIPT', language : 'JAVASCRIPT', isSelected : false },
            { desc:'PYTHON', language : 'PYTHON', isSelected : false },
            { desc:'C', language : 'C', isSelected : false },
            { desc:'C#', language : 'CSHARP', isSelected : false },
            { desc:'C++', language : 'CPLPL', isSelected : false },
            { desc:'KOTLIN', language : 'KOTLIN', isSelected : false },
            { desc:'ETC', language : 'ETC', isSelected : false},
        ]
    )

    const [keyword, onChangeKeyword, keywordReset] = useInput('')


    // 언어 버튼 클릭 이벤트
    const onClickLanguageHandler = (idx, isSelected) => {
        const updateLanguageList = languageList.map((language, index) => {
            if (index === idx) {
                return { ...language, isSelected: !isSelected }
            }else{
                return { ...language, isSelected: false }
            }
        });
        setLanguageList(updateLanguageList)
    }
    

    // 동네 버튼 클릭 이벤트
    const onClickGetLatLngHandler = (idx, isSelected, adress) => {
        setIsTargeting(true)        // 쿼리 실행 여부 변경
        const updateTownList = townList.map((town, index) => {
            if (index === idx) {
                return { ...town, isSelected: !isSelected }
            }else{
                return { ...town, isSelected: false }
            }
        });
        setTownList(updateTownList)
        setTargetAddress(adress)    // 현재 클릭된 동네의 주소
    }

    // 버튼을 클릭해서 좌표값을 얻어와야 하는 주소가 변경된 경우
    useEffect(() => {
        if (targetAddress) {
            queryClient.resetQueries('getLatLng')  // 기존 조회 결과를 초기화
            setTargetAddress(null)                 // 변환 대상 주소값 초기화
        }
    }, [targetAddress])

    // 쿼리 실행 여부가 변경되었고 true 일 경우
    useEffect(() => {
        if (isTargeting) {
            getLatLngQuery.refetch() // 선택된 주소값을 좌표값으로 반환하는 쿼리 재실행
            setIsTargeting(false)    // 쿼리 실행 여부 초기화
        }
    }, [isTargeting])

    // 카카오 주소->좌표 성공 시 수행할 로직
    useEffect(() => {
        // 카카오 api 에서 위도 경도를 반대로 줘서 반대로 일단 받음. 
        if (getLatLngQuery.isSuccess) {
            // console.log("[INFO] 좌표 요청 결과 (", getLatLngQuery.data.documents[0].y, getLatLngQuery.data.documents[0].x, ")")
            dispatcher(fetchUserLocation({ latitude: getLatLngQuery.data.documents[0].y, longitude: getLatLngQuery.data.documents[0].x }))
            dispatcher(__searchLocation({ latitude: getLatLngQuery.data.documents[0].y, longitude: getLatLngQuery.data.documents[0].x }))
            // // 데이터 조회하기
            // sendData(getLatLngQuery.data.documents[0].y, getLatLngQuery.data.documents[0].x)
        }
    }, [getLatLngQuery.isSuccess])

    useEffect(()=>{
        const setFiltering = () => {
            let languageFilterCnt = 0
            languageList.map((language) => {
                if(language.isSelected){
                    languageFilterCnt = languageFilterCnt+1
                    dispatcher(__searchLanguage(language.language))
                }
            });
            return languageFilterCnt
        }
        if(setFiltering() === 0){
            dispatcher(__searchLanguage(''))
        }
    },[languageList])

    useEffect(()=>{
        dispatcher(__searchKeyword(keyword))
    },[keyword])

    // if (getLatLngQuery.isError) {
    //     return <div>주소 to 좌표 변환중 에러발생</div>
    // }
    // if (getLatLngQuery.isLoading) {
    //     return <div>주소 to 좌표 변환중</div>
    // }

    return (
        <SearchContaniner>
            <Search>
                <SearchTitle>내 주변 모각코 찾아보기</SearchTitle>
                <SearchBar>
                    <div>
                        <img src={`${process.env.PUBLIC_URL}/image/zoomOut.svg`} alt="돋보기아이콘" width='20' height='20' />
                    </div>
                    <SearchInput type="text" value={keyword} onChange={(e) => {onChangeKeyword(e)}} placeholder='원하시는 모각코 장소, 제목을 검색하세요.' autoComplete='do-not-autofill' />
                    <SearchResetBtn closeBtn={`${process.env.PUBLIC_URL}/image/inputDeleteBtn.webp`} onClick={()=>{keywordReset()}}></SearchResetBtn>
                    
                </SearchBar>
            </Search>
            
            <div>
                <SearcFilterTitle>인기동네</SearcFilterTitle>
                <div>
                    {townList.map((town, idx) => {
                        return <SearchTownBtn isSelected={town.isSelected} onClick={() => (onClickGetLatLngHandler(idx, town.isSelected, town.neighborhood))}>{town.neighborhood.split(' ')[2]}</SearchTownBtn>
                    })}
                </div>
            </div>
            
            <div>
                <SearcFilterTitle>언어</SearcFilterTitle>
                <SearchLanguageBtnWrap>
                    {languageList.map((language, idx) => {
                        return <SearchLanguageBtn isSelected={language.isSelected} onClick={() => (onClickLanguageHandler(idx, language.isSelected))}>{language.desc}</SearchLanguageBtn>
                    })}
                </SearchLanguageBtnWrap>
            </div>
        </SearchContaniner>
    );
}

export const SearchContaniner = styled.div`
    position: relative;
    width: 486px;
    height: 413px;
    background-color: transparent;
    left: calc(100% - 486px);
    display: flex;
    flex-direction: column;
    row-gap: 27px;
`
export const SearchLanguageBtnWrap = styled.div`
`
export const SearchLanguageBtn = styled.button`
    padding: 9px 20px;
    margin-right: 9px;
    margin-bottom: 12px;
    min-width: 72px;
    height: 42px;
    /* border: 0.5px solid #FFFFFF; */
    border: 0.5px solid rgba(221, 221, 221, 0.5);
    border-radius: 28px;
    cursor: pointer;
    background : ${(props)=>{
        return props.isSelected?'var(--po-de)':'transparent'
    }};
    /* color : ${(props)=>{
        return props.isSelected?'#464646':'#FFFFFF'
    }}; */
    color : ${(props)=>{
        return props.isSelected?'black':'#FFFFFF'
    }};
    
    overflow: hidden;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    /* line-height: 24px; */
    line-height: 133%;

    &:hover {
        transition: 0.3s;
        background: #68707C;
        color : #FFFFFF;
    }
    &:active {
        transition: 0.3s;
        background: #3E4957;
        color : #FFFFFF;
    }

`

export const SearchTownBtn = styled.button`
    padding: 9px 20px;
    margin-right: 9px;
    margin-bottom: 12px;
    min-width: 72px;
    height: 42px;
    border: 0.5px solid rgba(221, 221, 221, 0.5);
    border-radius: 28px;
    cursor: pointer;
    background : ${(props)=>{
        return props.isSelected?'var(--po-de)':'transparent'
    }};
    /* color : ${(props)=>{
        return props.isSelected?'#464646':'#FFFFFF'
    }}; */
    color : ${(props)=>{
        return props.isSelected?'black':'#FFFFFF'
    }};
    overflow: hidden;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    /* line-height: 24px; */
    line-height: 133%;

    &:hover {
        transition: 0.3s;
        background: #68707C;
        color : #FFFFFF;
    }
    &:active {
        transition: 0.3s;
        background: #3E4957;
        color : #FFFFFF;
    }
`

export const SearchTitle = styled.h1`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 29px;
    line-height: 35px;
    display: flex;
    align-items: center;
    color: #FFFFFF;
`
export const SearcFilterTitle = styled.h2`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    /* line-height: 24px; */
    line-height : 109%;
    color: #FFFFFF;
    margin-bottom: 20px;
`
export const SearchBar = styled.div`
    width: 470px;
    height: 40px;
    background: var(--bg-li);
    border-radius: 114px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
`
export const SearchInput = styled.input`
    appearance: none;
    background: none;
    width: 369px;
    height: 23px;
    border:none;
    color: #FFFFFF;
    outline: none;
    &::placeholder{
        color: #BEBEBE;
    }
`
export const SearchResetBtn = styled.button`
    width: 13px;
    height: 13px;
    border: none;
    color: #FFFFFF;
    background-image: ${(props) =>
    `url(${props.closeBtn})`
    };

    background-color: transparent;
    background-position: center;
    background-size:cover;
`

export const Search = styled.div`
    display: flex;
    flex-direction: column;
    gap : 28px
`

export default MainSearch









