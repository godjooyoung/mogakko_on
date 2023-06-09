import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useQuery, useQueryClient } from 'react-query';
import { getBestMember } from '../axios/api/member'

function MainBest() {
    //BestMember 조회
    const { isLoading, isError, data } = useQuery("getBestMember", getBestMember)

    // 하드코딩
    const [bestMemberList, setBestMemberList] = useState(
        [
            {
                "member":
                {
                    "createdAt": "2023-06-06T22:34:10.020628",
                    "modifiedAt": "2023-06-07T22:06:51.769667",
                    "id": 2,
                    "email": "dsin1118@kakao.com",
                    "nickname": "르탄이3",
                    "role": "USER",
                    "githubId": null,
                    "socialType": null,
                    "profileImage": "https://mogakkos3.s3.ap-northeast-2.amazonaws.com/bf676979-18ae-4b6d-a187-1cbcd4e96641_하루!.jpg",
                    "socialUid": null,
                    "memberStatusCode": "2514",
                    "codingTem": 36.5
                }, "totalTimer": "162H10M", "totalTimerWeek": "162H10M"
            },
            {
                "member":
                {
                    "createdAt": "2023-06-06T22:34:15.340008",
                    "modifiedAt": "2023-06-07T12:17:27.922704",
                    "id": 3,
                    "email": "test12@naver.com",
                    "nickname": "짱주영",
                    "role": "USER",
                    "githubId": null,
                    "socialType": null,
                    "profileImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtArY0iIz1b6rGdZ6xkSegyALtWQKBjupKJQ&usqp=CAU",
                    "socialUid": null,
                    "memberStatusCode": "102",
                    "codingTem": 36.5
                }, "totalTimer": "162H10M", "totalTimerWeek": "162H10M"
            },
        ]
    )

    useEffect(()=>{
        if(data){
            setBestMemberList(data)
        }
    },[data])
    return (
        <BestMemberWrap>
            <BestMemberCardContainer>
                <TitleWrap>
                    <BestTitle>오늘의 ON:S</BestTitle>
                </TitleWrap>
                <BestMemberCardWarp>
                    <BestMemberCardGrid>
                        {
                            bestMemberList&&bestMemberList.map((bestMember)=>{
                                return (
                                    <BestMemberCard>
                                    <BestMemberProfileImage>프사영역</BestMemberProfileImage>
                                    <BestMemberName>이름영역박네글자</BestMemberName>
                                    <BestMemberCardContentContainer>
                                        <BestMemberCardContent>
                                            <BestMemberCardContentTitle>코딩 온도</BestMemberCardContentTitle>
                                            <BestMemberCardContentDetials>
                                                <span><img src={`${process.env.PUBLIC_URL}/image/mannerTemp.webp`}/></span><span>내용1 상세</span><span>36.5</span>
                                            </BestMemberCardContentDetials>
                                        </BestMemberCardContent>
                                        {/* 15px 간격 */}
                                        <BestMemberCardContent>
                                            <BestMemberCardContentTitle>이번주 총 공부 시간</BestMemberCardContentTitle>
                                            <BestMemberCardContentDetials>
                                                <span><img src={`${process.env.PUBLIC_URL}/image/timer.webp`}/></span><div>내용1 상세</div><span>12H 00M</span>
                                            </BestMemberCardContentDetials>
                                        </BestMemberCardContent>
                                    </BestMemberCardContentContainer>
                                </BestMemberCard>
                                )
                            })
                        }


                    </BestMemberCardGrid>
                    
                </BestMemberCardWarp>
                <BestMemberButtonContainer><button>더보기 버튼</button></BestMemberButtonContainer>
            </BestMemberCardContainer>
            
        </BestMemberWrap>
    );
}

export default MainBest;

// 레이아웃 css
export const BestMemberWrap = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    width: 100%;    
    color : #FFFFFF;
`
export const TitleWrap = styled.div`
    width: 996px;
    margin: 43px auto 36px;
`
export const BestTitle = styled.h2`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 29px;
    line-height: 35px;
    color : #FFFFFF;
`
export const BestMemberCardContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 auto;
    flex-direction: column;
`
export const BestMemberCardWarp = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 auto;
`
export const BestMemberCardGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: max-content;
    column-gap: 20px;
    row-gap: 36px;
`
export const BestMemberButtonContainer = styled.div`
    height: 164px;
    margin: 0 auto;
    display: flex;
    align-items: center;
`

// 카드 css

export const BestMemberCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 234px;
    height: 269px;
    background: #394254;
    border-radius: 20px;
`

export const BestMemberProfileImage = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 0 1px #ffffff;
    margin: 26px auto 12px;
`

export const BestMemberName = styled.p`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 19px;
    line-height: 28px;
    text-align: center;
    color: #FFFFFF;
`

export const BestMemberCardContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    
`
export const BestMemberCardContent = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0px 36px;
`

export const BestMemberCardContentTitle = styled.h4`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    /* line-height: 28px; */
    line-height: 280%;
`
export const BestMemberCardContentDetials = styled.div`
    display: flex;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 8px;
    /* line-height: 28px; */
    /* line-height: 280%; */
    color: #FFFFFF;
    column-gap: 5px;
    align-items: center;
`