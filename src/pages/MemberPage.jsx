import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUserProfile, requestFriend } from '../axios/api/mypage'
import styled from 'styled-components'
import Header from "../components/common/Header";
import { useParams } from 'react-router-dom';

function MemberPage() {

  const { id } = useParams();
  const { isLoading, isError, data } = useQuery("getUserProfile", () => getUserProfile(id))
  const [value, setValue] = useState(0)
  const [onMouse, setOnMouse] = useState(false)
  const [gitHub, setGitHub] = useState(false)
  const [userGitHubId, setuserGitHubId] = useState('')
  useEffect(() => {
    setValue(data && data.data.data.member.codingTem);
    const interval = setInterval(() => {
      if (value < data) {
        setValue((prevValue) => prevValue + 1);
      }
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [data]);
  useEffect(() => {
    setuserGitHubId(data && data.data.data.member.githubId)
  }, [data]);
  // 친구 요청 보내기
  const friendRequetMutation = useMutation(requestFriend, {
    onSuccess: (response) => {
      console.log(">>> 친구 요청 보내기 성공", response)
      console.log(">>> 친구 요청 보내기 성공", response.data.data)
    },
  })
  console.log('datadatadatadatadatadatadata', data)
  useEffect(() => {
    if (isLoading) {
      console.log("조회결과 loading")
    }
    if (isError) {
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
    console.log("나랑 친구할래?", target)
    friendRequetMutation.mutate(target)
  }

  if (isLoading) {
    return <>loading...</>
  }

  // 물은표 버튼 hover시 나오는 정보창
  const statusOnMouseHandler = () => {
    setOnMouse(true)
  }

  const statusOffMouseHandler = () => {
    setOnMouse(false)
  }
  console.log('userGitHubIduserGitHubIduserGitHubIduserGitHubId',userGitHubId)
  return (
    <>
      <Header />
      <MyPageTopContentWrap>
        <ProfileModifyWrap>
          <ProfileModifyContent encType="multipart/form-data" onSubmit={(e) => { e.preventDefault() }}>
            <ImageWrap BgImg={preview} />
            <MyPageUserName>{data && data.data.data.member.nickname}</MyPageUserName>
            <button onClick={() => (onClickRqFriendshipBtnHandler(data && data.data.data.member.nickname))}>친구요청</button>
          </ProfileModifyContent>
          <TimerWrap>
            <div>
              <TopContentTitle>총 순공시간</TopContentTitle>
              <TopContentTitleItem>{data && data.data.data.totalTimer}</TopContentTitleItem>
            </div>

            <div>
              <TopContentTitle>이번 주 순공 시간</TopContentTitle>
              <TopContentTitleItem>{data && data.data.data.totalTimerWeek}</TopContentTitleItem>
            </div>

            <div>
              <TopContentTitle>
                Status
                <img
                  src={`${process.env.PUBLIC_URL}/image/status.webp`}
                  onMouseEnter={() => {
                    statusOnMouseHandler()
                  }}
                  onMouseLeave={() => {
                    statusOffMouseHandler()
                  }}
                >
                </img>
                {
                  onMouse &&
                  <MouseHoverBox>
                    <p>102 : <span>회원가입 시 기본값</span></p>
                    <p>200 : <span>처음 프로필 등록시 변경</span></p>
                    <p>400 : <span>신고 1회</span></p>
                    <p>401 : <span>신고 2회</span></p>
                    <p>404 : <span>신고 3회</span></p>
                    <p>109 : <span>모각코 시간 1시간 9분 경과</span></p>
                    <p>486 : <span>모각코 시간 4시간 8분 6초 경과</span></p>
                    <p>1004 : <span>모각코 시간 10시간 4분 경과</span></p>
                    <p>2514 : <span>모각코 시간 25시간 14분 경과</span></p>
                  </MouseHoverBox>
                }
              </TopContentTitle>
              <TopContentTitleItem>{data && data.data.data.member.memberStatusCode}</TopContentTitleItem>
            </div>

            <Temperaturecontainer>
              <p>
                코딩온도
              </p>
              <TemperatureWrap>
                <ProgressContainer>
                  <Progress style={{ width: `${value}%` }} />
                </ProgressContainer>
                <span>{data && data.data.data.member.codingTem}%</span>
              </TemperatureWrap>
            </Temperaturecontainer>
          </TimerWrap>
        </ProfileModifyWrap>
      </MyPageTopContentWrap>

      <MyPageMiddleContentWrap>
        <p>깃허브 잔디</p>
        <MyPageMiddleContent>
          <GitHubImage src={`https://ghchart.rshah.org/394254/${userGitHubId}`} />
        </MyPageMiddleContent>
      </MyPageMiddleContentWrap>
    </>
  )
}

const MyPageTopContentWrap = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ProfileModifyWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`

const ProfileModifyContent = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 50px;
  button {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    background: #00F0FF;
    border-radius: 24.7692px;
    color: #464646;
    border: none;
    padding: 7px 15px;
    margin-top: 28px;
    transition: all 0.3s;
    &:hover {
      background: #00C5D1;
    }
  }
`

const MyPageUserName = styled.p`
  width: 100%;
  font-size: 32px;
  color: white;
  text-align: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 42px;
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
  margin-bottom: 28px;
`

const TimerWrap = styled.div`
  width: 996px;
  height: 150px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 35px;
  background: #394254;
  border-radius: 10px;
`
const TopContentTitle = styled.p`
  position: relative;
  font-size: 18px;
  color: #00F0FF;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 17px;

  img {
      margin-left: 7px;
  }
`

const TopContentTitleItem = styled.h1`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 35px;
  color: #FFFFFF;
`

const MouseHoverBox = styled.div`
  position: absolute;
  right: -170px;
  bottom: -235px;
  width: 215px;
  height: 229px;
  background: #F9F9FA;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
  p {
    font-weight: 900;
    font-size: 11px;
    color: #464646;
    margin-bottom: 7px;
  }

  span {
    font-weight: 700;
    font-size: 9px;
    color: #464646;
  }
`

const Temperaturecontainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  p {
    font-size: 17px;
    color: #00F0FF;

    img {
      margin-bottom: 2px;
    }
  }
`

const TemperatureWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  span {
    font-size: 14px;
    color: #00F0FF;
  }
`

const ProgressContainer = styled.div`
  width: 100px;
  height: 13.76px;
  margin-top: 2px;
  background:transparent;
  border-radius: 33px;
  border: 1px solid white;
`;

const Progress = styled.div`
  height: 100%;
  border-radius:10px;
  background: #00F0FF;
  transition: width 1s ease;
  border: none;
`;

const MyPageMiddleContentWrap = styled.div`
  height: 204px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  p {
    width: 996px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 23px;
    color: #FFFFFF;
  }
`

const MyPageMiddleContent = styled.div`
  width: 996px;
  height: 160px;
  background-color: white;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 8px;
  margin-top: 10px;
`

const GitHubImage = styled.img`
  width: 996px;
  height: 130px;
`


export default MemberPage