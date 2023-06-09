import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useQuery, useQueryClient } from 'react-query';
import { getBestMember } from '../axios/api/member'
import { useNavigate } from 'react-router-dom';

function MainBest() {
    const navigate = useNavigate();

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

    useEffect(() => {
        if (data) {
            setBestMemberList(data)
        }
    }, [data])

    // useEffect(() => {
    //     setValue(data && data.data.data.member.codingTem);
    //     const interval = setInterval(() => {
    //         if (value < data) {
    //         setValue((prevValue) => prevValue + 1);
    //     }
    // }, 10); ms
    
    // return () => {
    //     clearInterval(interval);
    // };
    // }, [data]);

    // 아바타 생성 함수
    const avataGenHandler = (nickName, profileImageUrl) => {
        let avataGen
        if(profileImageUrl === 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtArY0iIz1b6rGdZ6xkSegyALtWQKBjupKJQ&usqp=CAU'){
            avataGen = `https://source.boringavatars.com/beam/120/${nickName}?colors=00F0FF,172435,394254,EAEBED,F9F9FA`
        }else{
            avataGen = profileImageUrl
            
        }
        return <><img src={avataGen} alt="프로필사진" /></>   
    }

    // 순공시간 퍼센트 함수
    const totalStudyTmCalHandler = (time) => {
        console.log("------------------>",time) // 00H00M
        let hh = time.slice(0, -1).split('H')[0]
        let mm = time.slice(0, -1).split('H')[1]
        console.log("::시간", hh)
        console.log("::분 ", mm)
        console.log("::형변환 시간", Number(hh))
        console.log("::형변환 분 ", Number(mm))
        let totTime = Number(hh)*60
        totTime = Number(totTime)+Number(mm)

        console.log("::순공 분으로 계산한거 ", Number(totTime))
        console.log("::퍼센트계산 ", ((Number(totTime)/420)*100))
        
        if(((Number(totTime)/420)*100) > 100){
            return 100
        }else{
            return (Number(totTime)/420)*100
        }
    }
    
    //userProfileHandler
    const userProfileHandler = (id) => {
        navigate('/profile/'+id)
    }

    return (
        <BestMemberWrap>
            <BestMemberCardContainer>
                <TitleWrap>
                    <BestTitle>오늘의 ON:S</BestTitle>
                </TitleWrap>
                <BestMemberCardWarp>
                    <BestMemberCardGrid>
                        {
                            bestMemberList && bestMemberList.map((bestMember) => {
                                return (
                                    <BestMemberCard onClick={()=>{userProfileHandler(bestMember.member.id)}}>
                                        <BestMemberProfileImage>
                                            {avataGenHandler(bestMember.member.nickname, bestMember.member.profileImage)}
                                            {/* <img src={bestMember.member.profileImage}></img> */}
                                        </BestMemberProfileImage>
                                        <BestMemberName>{bestMember.member.nickname}</BestMemberName>
                                        <BestMemberCardContentContainer>
                                            <BestMemberCardContent>
                                                <BestMemberCardContentTitle>코딩 온도</BestMemberCardContentTitle>
                                                <BestMemberCardContentDetials>
                                                    <span><img src={`${process.env.PUBLIC_URL}/image/mannerTemp.webp`} /></span>
                                                    <ProgressContainer>
                                                        <Progress style={{ width: `${bestMember.member.codingTem}%` }} />
                                                    </ProgressContainer>
                                                    <span>{bestMember.member.codingTem}</span>
                                                </BestMemberCardContentDetials>
                                            </BestMemberCardContent>
                                            {/* 15px 간격 */}
                                            <BestMemberCardContent>
                                                <BestMemberCardContentTitle>이번주 총 공부 시간</BestMemberCardContentTitle>
                                                <BestMemberCardContentDetials>
                                                    <span><img src={`${process.env.PUBLIC_URL}/image/timer.webp`} /></span>
                                                    <ProgressContainer>
                                                        <Progress style={{ width: `${totalStudyTmCalHandler(bestMember.totalTimerWeek)}%` }} />
                                                    </ProgressContainer>
                                                    <span>{bestMember.totalTimerWeek}</span>
                                                </BestMemberCardContentDetials>
                                            </BestMemberCardContent>
                                        </BestMemberCardContentContainer>
                                    </BestMemberCard>
                                )
                            })
                        }
                    </BestMemberCardGrid>

                </BestMemberCardWarp>
                <BestMemberButtonContainer><button style={{'visibility':'hidden'}}>더보기 버튼</button></BestMemberButtonContainer>
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
    &:hover {
        transform: scale(1.03);
    }
    &:active {
        background: #222A3A;
        transform: scale(1);
    }
    cursor: pointer;
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
const ProgressContainer = styled.div`
    background: transparent;
    border-radius: 62px;
    border: none;
    width: 119px;
    height: 4px;
    border: 0.5px solid #FFFFFF;
`

const Progress = styled.div`
    height: 100%;
    border-radius: 62px;
    background: #00F0FF;
    transition: width 1s ease;
    border: none;
`