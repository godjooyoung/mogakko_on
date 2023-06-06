import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUserProfile, requestFriend } from '../axios/api/mypage'
import styled from 'styled-components'
import Header from "../components/common/Header";
import { useParams } from 'react-router-dom';

function MemberPage() {

    const { id } = useParams();
    const { isLoading, isError, data } = useQuery("getUserProfile", () => getUserProfile(id))
    
    // 친구 요청 보내기
    const friendRequetMutation = useMutation(requestFriend, {
      onSuccess: (response) => {
        console.log(">>> 친구 요청 보내기 성공", response)
        console.log(">>> 친구 요청 보내기 성공", response.data.data)
      },
    })

    useEffect(() => {
        if(isLoading){
          console.log("조회결과 loading")
        }
        if(isError){
          console.log("조회결과 error")
        }
        if (data) {
            console.log("조회결과 data", data)
            setPreview(data.data.data.member.profileImage)
        }
    }, [data])

    const [preview, setPreview] = useState(data && data.data.data.member.profileImage)

    // 00:00:00 to 00H00M
    const formatTime = (timeString) => {
        const time = new Date(`2000-01-01T${timeString}`);
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}H${formattedMinutes}M`;
    }

    // 친구요청 
    const onClickRqFriendshipBtnHandler = (target) => {
      console.log("나랑 친구할래?",target)
      friendRequetMutation.mutate(target)
    }

    if(isLoading){
      return <>loading...</>
    }
    return (
        <>
            <Header />
            <MyPageTopContentWrap>
                <ProfileModifyWrap>
                    <ProfileModifyContent encType="multipart/form-data" onSubmit={(e) => { e.preventDefault() }}>
                        <ImageWrap BgImg={preview} />
                        <button onClick={()=>(onClickRqFriendshipBtnHandler(data && data.data.data.member.nickname))}>친구요청</button>
                    </ProfileModifyContent>
                    <MyPageUserName>{data && data.data.data.member.nickname}</MyPageUserName>
                    <TimerWrap>
                        <div>
                            <TopContentTitle>총 순공시간</TopContentTitle>
                            <TopContentTitleItem>{formatTime(data && data.data.data.mogakkoTotalTime)}</TopContentTitleItem>
                        </div>

                        <div>
                            <TopContentTitle>이번 주 순공 시간</TopContentTitle>
                            <TopContentTitleItem>3H 8M</TopContentTitleItem>
                        </div>

                        <div>
                            <TopContentTitle>Status</TopContentTitle>
                            <TopContentTitleItem>502</TopContentTitleItem>
                        </div>
                    </TimerWrap>
                </ProfileModifyWrap>
            </MyPageTopContentWrap>

            <MyPageMiddleContentWrap>
                <MyPageMiddleContent>
                    <GitHubImage src="https://ghchart.rshah.org/394254/Shinheeje" />
                </MyPageMiddleContent>
            </MyPageMiddleContentWrap>
        </>
    )
}

const MyPageTopContentWrap = styled.div`
  height: 264px;
  background-color: #394254;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`

const ProfileModifyWrap = styled.div`
  display: flex;
`

const ProfileModifyContent = styled.form`
  position: relative;
`

const MyPageUserName = styled.p`
  font-size: 32px;
  color: white;
  margin-right: 100px;
`

const ImageWrap = styled.div`
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background-image: ${(props) =>
        `url(${props.BgImg})`
    };
  background-position:center;
  background-size:contain;
  background-color : white;
`

const TimerWrap = styled.div`
  width: 550px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 20px;
`
const TopContentTitle = styled.p`
  font-size: 18px;
`

const TopContentTitleItem = styled.h1`
  font-size: 32px;
`

const MyPageMiddleContentWrap = styled.div`
  height: 204px;
  background-color: #394254;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

const MyPageMiddleContent = styled.div`
  background-color: white;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 8px;
`

const GitHubImage = styled.img`
  width: 1200px;
`


export default MemberPage