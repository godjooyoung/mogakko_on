import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUserProfile, requestFriend } from '../axios/api/mypage'
import styled from 'styled-components'
import Header from "../components/common/Header";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ChartLan from '../components/ChartLan';
import ChartTimes from '../components/ChartTimes';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ChartWeekly from '../components/ChartWeekly';
import CommonPopup from '../components/common/CommonPopup'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function MemberPage() {

  useEffect(() => {
    AOS.init();
  })
  const queryClient = useQueryClient()
  const { id } = useParams();
  const { isLoading, isError, data } = useQuery("getUserProfile", () => getUserProfile(id) , {
    onSuccess: () => {
      queryClient.invalidateQueries(getUserProfile)
    }
  })
  const [value, setValue] = useState(0)
  const [statusonMouse, setStatusOnMouse] = useState(false)
  const [temponMouse, setTempOnMouse] = useState(false)
  const navigate = useNavigate();

  // 친구 요청 성공 모달
  const [friendReqSuc, setFriendReqSuc] = useState(false)
  // 온도 프로그레스 애니메이션
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

  // 친구 요청 보내기
  const friendRequetMutation = useMutation(requestFriend, {
    onSuccess: (response) => {
      //console.log(">>> 친구 요청 보내기 성공", response)
      //console.log(">>> 친구 요청 보내기 성공", response.data.data)
      //TODO 에러 메세지 처리
      //navigate('/')
    },
    onError: (error) => {
      console.log('error.response.data.messageerror.response.data.messageerror.response.data.message', error.response.data.message)
    }
  })

  const [userGitHubId, setuserGitHubId] = useState(null)

  useEffect(() => {
    if (isLoading) {
      // console.log("조회결과 loading")
    }
    if (isError) {
      // console.log("조회결과 error")
    }
    if (data) {
      // console.log("조회결과 data", data)
      setPreview(data.data.data.member.profileImage)
      setuserGitHubId(data && data.data.data.member.githubId)
    }
  }, [data])

  const [preview, setPreview] = useState(data && data.data.data.member.profileImage)

  // // 00:00:00 to 00H00M
  // const formatTime = (timeString) => {
  //   const time = new Date(`2000-01-01T${timeString}`);
  //   const hours = time.getHours();
  //   const minutes = time.getMinutes();
  //   const formattedHours = hours < 10 ? `0${hours}` : hours;
  //   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  //   return `${formattedHours}H${formattedMinutes}M`;
  // }

  // 친구요청 
  const onClickRqFriendshipBtnHandler = (target) => {
    // console.log("나랑 친구할래?", target)
    friendRequetMutation.mutate(target)
  }

  if (isLoading) {
    return <>loading...</>
  }

  // 물음표 버튼 hover시 나오는 정보창 (status) 핸들러
  const statusOnMouseHandler = () => {
    setStatusOnMouse(true)
  }
  const statusOffMouseHandler = () => {
    setStatusOnMouse(false)
  }

  // 물음표 버튼 hover시 나오는 정보창 (온도) 핸들러
  const tempOnMouseHandler = () => {
    setTempOnMouse(true)
  }
  const tempOffMouseHandler = () => {
    setTempOnMouse(false)
  }

  // 아바타 프로필 호출 함수
  const avataGenHandler = (nickName, profileImageUrl) => {
    let avataGen
    if (profileImageUrl === 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtArY0iIz1b6rGdZ6xkSegyALtWQKBjupKJQ&usqp=CAU') {
      avataGen = `https://source.boringavatars.com/beam/120/${nickName}?colors=00F0FF,172435,394254,EAEBED,F9F9FA`
    } else {
      avataGen = profileImageUrl

    }
    return avataGen
  }

  // 코드 복사 
  const myCode = data && data.data.data.member.friendCode

  return (
    <>
      <Header />
      <FlexBox>
        <div>
          <MypageWrap>
            <MypageNavbar>
              <ProfileModifyContent encType="multipart/form-data" onSubmit={(e) => { e.preventDefault() }}>
                <ImageWrap BgImg={avataGenHandler(data.data.data.member.nickname, preview)} width='155px' height='155px' />
              </ProfileModifyContent>
              <MyPageUserName>{data && data.data.data.member.nickname}</MyPageUserName>

              <MyCodeWrap>
                <MyCode>나의 코드: {data && data.data.data.member.friendCode}</MyCode>
                {/* <CopyBtn  onClick={() => handleCopyClipBoard(data && data.data.data.member.friendCode)}
                  imgUrl={`${process.env.PUBLIC_URL}/image/copyBtn.webp`}
                >COPY</CopyBtn> */}
                <CopyToClipboard text={myCode} onCopy={() => alert("클립보드에 복사되었습니다.")}>
                  <CopyBtn
                    imgUrl={`${process.env.PUBLIC_URL}/image/copyBtn.webp`}
                  ></CopyBtn>
                </CopyToClipboard>
              </MyCodeWrap>
              {
                // data && data.data.data.friend === false ?
                //   <FriendReqBtn
                //     onClick={() => {
                //       onClickRqFriendshipBtnHandler(data && data.data.data.member.nickname)
                //       setFriendReqSuc(!friendReqSuc)
                //     }
                //     }>친구신청</FriendReqBtn> : null

                data && data.data.data.friend === true ? null : data && !data.data.data.pending ? <FriendReqBtn onClick={() => {
                  onClickRqFriendshipBtnHandler(data && data.data.data.member.nickname)
                  setFriendReqSuc(!friendReqSuc)
                }}>친구신청</FriendReqBtn> : <FriendReqWaitBtn>대기중</FriendReqWaitBtn>
              }

              {
                friendReqSuc && <CommonPopup
                  msg={'친구신청 완료!!'}
                  secondMsg={'친구 수락을 기다려주세요.'}
                  isBtns={false}
                  priMsg={'확인'}
                  priHander={() => setFriendReqSuc(!friendReqSuc)}
                  closeHander={() => setFriendReqSuc(!friendReqSuc)} />
              }
            </MypageNavbar>
            <WidthBox>
              <MyPageTopContentWrap>
                <MogakkoTitle>모각코 데이터</MogakkoTitle>
                <ProfileModifyWrap>

                  <TotalTimewrap>
                    <TopContentTitle>오늘 공부시간</TopContentTitle>
                    <TopContentTitleItem>{data && data.data.data.timeOfWeek.today}</TopContentTitleItem>
                  </TotalTimewrap>

                  <WeeklyTimeWrap>
                    <TopContentTitle>총 공부 시간</TopContentTitle>
                    <TopContentTitleItem>{data && data.data.data.timeOfWeek.weekTotal}</TopContentTitleItem>
                  </WeeklyTimeWrap>
                  <Temperaturecontainer>
                    <TemperatureTitle>ON°
                      <img
                        src={`${process.env.PUBLIC_URL}/image/status.webp`}
                        onMouseEnter={() => {
                          tempOnMouseHandler()
                        }}
                        onMouseLeave={() => {
                          tempOffMouseHandler()
                        }}
                      ></img>
                    </TemperatureTitle>
                    {
                      temponMouse &&
                      <TemperatureMouseHoverBox>
                        <TemperatureMouseHoverBoxdesc>
                          당신의 코딩온도는 몇도인가요?<br />
                          공부 시간이 늘어날수록<br />
                          코딩 온도도 올라가요! ( 10M <img src={`${process.env.PUBLIC_URL}/image/enterArrow.webp`} alt="화살표 아이콘" /> 0.01)
                        </TemperatureMouseHoverBoxdesc>
                      </TemperatureMouseHoverBox>
                    }
                    <TemperatureWrap>
                      <ProgressContainer>
                        <Progress style={{ width: `${value}%` }} />
                      </ProgressContainer>
                      <span>{data && data.data.data.member.codingTem}°</span>
                    </TemperatureWrap>
                  </Temperaturecontainer>

                  <StatusWrap>
                    <TopContentTitleWrap>
                      <TopContentTitle>상태코드</TopContentTitle>
                      <Status
                        statusImg={`${process.env.PUBLIC_URL}/image/status.webp`}
                        onMouseEnter={() => {
                          statusOnMouseHandler()
                        }}
                        onMouseLeave={() => {
                          statusOffMouseHandler()
                        }}
                      ></Status>
                      {
                        statusonMouse &&
                        <StatusMouseHoverBox>
                          <p>102 : <span>회원가입 시 기본값</span></p>
                          <p>200 : <span>처음 프로필 등록시 변경</span></p>
                          <p>109 : <span>모각코 시간 1시간 9분 경과</span></p>
                          <p>486 : <span>모각코 시간 4시간 8분 6초 경과</span></p>
                          <p>1004 : <span>모각코 시간 10시간 4분 경과</span></p>
                          <p>2514 : <span>모각코 시간 25시간 14분 경과</span></p>
                        </StatusMouseHoverBox>
                      }
                    </TopContentTitleWrap>
                    <TopContentTitleItem>{data && data.data.data.member.memberStatusCode}</TopContentTitleItem>
                  </StatusWrap>
                </ProfileModifyWrap>
              </MyPageTopContentWrap>

              <ChartWrap>
                <WeeklyStudyTimewrap>
                  <p>이번 주 공부시간</p>
                  <AttendanceCheckWrap data-aos="fade-down" data-aos-duration="1000">
                    <ChartWeekly data={data && data.data.data.timeOfWeek} />
                  </AttendanceCheckWrap>
                  <StudyTime data-aos="fade-right" data-aos-duration="1000">
                    <ChartTimes data={data && data.data.data.timeOfWeek} />
                  </StudyTime>
                </WeeklyStudyTimewrap>
                <TotalLanguageWrap>
                  <p>통합 선택 언어</p>
                  <TotalLanguage data-aos="fade-left" data-aos-duration="1000">
                    <ChartLan data={data && data.data.data.languageList} />
                  </TotalLanguage>
                </TotalLanguageWrap>
              </ChartWrap>

              <MyPageMiddleContentWrap>
                <GithubTitle>GitHub</GithubTitle>
                {
                  userGitHubId === null || userGitHubId === '' ?
                    <NullGithubBox>
                      <NullGithubBoxText>등록된 깃허브 잔디가 없습니다</NullGithubBoxText>
                    </NullGithubBox> :
                    <MyPageMiddleContent>
                      <GitHubImage src={`https://ghchart.rshah.org/394254/${userGitHubId}`} />
                    </MyPageMiddleContent>
                }
              </MyPageMiddleContentWrap>
            </WidthBox>
          </MypageWrap>
        </div>
      </FlexBox>
    </>
  )
}

const FlexBox = styled.div`
  display:flex;
  justify-content: center;
  align-items:center;
  height: calc(100vh - 79px);
`

const MyPageTopContentWrap = styled.div`
  height: 175px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`

const ProfileModifyWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const ProfileModifyContent = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const FriendReqBtn = styled.button`
  width: 92px;
  height: 34px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  background: var(--po-de);
  border-radius: 24.7692px;
  color: #464646;
  border: none;
  transition: all 0.3s;
  &:hover {
    transition: 0.2s;
    background: #00C5D1;
  }
`

const MyPageUserName = styled.p`
  width: 100%;
  font-size: 26px;
  margin-top: 26px;
  color: white;
  text-align: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
`

const ImageWrap = styled.div`
  width: 133px;
  height: 133px;
  border-radius: 50%;
  background-image: ${(props) =>
    `url(${props.BgImg})`
  };
  background-position:center;
  background-size:contain;
  background-color : white;
  border: 0.5px solid white;
`

const TimerWrap = styled.div`
  width: 996px;
  height: 150px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 35px;
  background: var(--bg-li);
  border-radius: 10px;
`
const TopContentTitle = styled.p`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: var(--po-de);
`

const TopContentTitleItem = styled.h1`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  color: #FFFFFF;
`

const MouseHoverBox = styled.div`
  position: absolute;
  z-index: 3;
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
  width: 207px;
  height: 108px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`

const TemperatureTitle = styled.p`
  width: 136.72px;
  font-size: 17px;
  color: var(--po-de);
  font-weight: 900;
  text-align: start;
  img {
    margin-left: 5px;
    margin-bottom: 2px;
  }
`
const TemperatureMouseHoverBox = styled.div`
  position: absolute;
  top: 60px;
  right: -20px;
  width: 250px;
  height: 80px;
  background-color: #F9F9FA;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 8px;
  text-align: center;
  line-height: 22px;
`

const TemperatureMouseHoverBoxdesc = styled.p`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  color: #464646;

  img {
    width: 9px;
  }
`


const TemperatureWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  span {
    font-size: 14px;
    color: var(--po-de);
  }
`



const ProgressContainer = styled.div`
  width: 100px;
  height: 8px;
  margin-top: 2px;
  background:transparent;
  border-radius: 33px;
  border: 1px solid white;
`;

const Progress = styled.div`
  height: 100%;
  border-radius:10px;
  background: var(--po-de);
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
`

const GithubTitle = styled.p`
    width: 895px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 21px;
    color: #FFFFFF;
`

const NullGithubBox = styled.div`
  width: 893px;
  height: 160px;
  background: var(--bg-li);
  border-radius: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const NullGithubBoxText = styled.p`
  color: #BEBEBE;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
`

const MyPageMiddleContent = styled.div`
  width: 893px;
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

const MypageWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MypageNavbar = styled.div`
  width: 240px;
  height: 800px;
  background: var(--bg-li);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  margin-right: 66px;
  padding: 39px 0 0 0;
`

const MyCodeWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
  margin-bottom: 25px;
`

const MyCode = styled.p`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #BEBEBE;
`

const CopyBtn = styled.button`
  width: 12px;
  height: 12px;
  font-size: 0;
  background-color: transparent;
  border: none;
  background-image: ${(props) =>
    `url(${props.imgUrl})`
  };
`

const WidthBox = styled.div`
  width: 893px;
`

const MogakkoTitle = styled.p`
  width: 100%;
  color: #FFFFFF;
  text-align: start;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 29px;
  margin-bottom: 10px;
`

const TotalTimewrap = styled.div`
  width: 207px;
  height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const WeeklyTimeWrap = styled.div`
  width: 207px;
  height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StatusWrap = styled.div`
  width: 207px;
  height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TopContentTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
`

const Status = styled.span`
  width: 18px;
  height: 18px;
  background-image: url(
      ${(props) => {
    return props.statusImg
  }}
  );
  background-repeat: no-repeat;
`

const StatusMouseHoverBox = styled.div`
  position: absolute;
  right: 0px;
  bottom: -170px;
  width: 215px;
  height: 160px;
  background: #F9F9FA;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
  z-index: 3;
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

const ChartWrap = styled.div`
  width: 100%;
  height: 376px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const WeeklyStudyTimewrap = styled.div`
  width: 486px;
  color: white;

  p{
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
    margin-bottom: 17px;
  }
`

const AttendanceCheckWrap = styled.div`
  width: 486px;
  height: 126px;
  background-color: var(--bg-li);
  /* background-color: transparent;
  margin-bottom: 18px; */
`

const StudyTime = styled.div`
  width: 486px;
  height: 183px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-li);
  /* background-color: transparent; */
  padding-bottom: 10px;
  height: 201px;
`

const TotalLanguageWrap = styled.div`
  width: 384px;
  color: white;
  p{
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
    margin-bottom: 17px;
  }
`

const TotalLanguage = styled.div`
  width: 384px;
  height: 327px;
  background-color: var(--bg-li);
  /* background-color: transparent; */
`
const FriendSearchBtn = styled.button`
  width: 62.76px;
  height: 23.77px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  background: var(--po-de);
  border-radius: 13.3117px;
  color: #464646;
  border: none;
  transition: all 0.2s;
  &:hover {
    background: #00C5D1;
  }
`


const FriendReqWaitBtn = styled.p`
  width: 92px;
  height: 34px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  /* background: var(--po-de); */
  border-radius: 24.7692px;
  color: var(--po-de);
  border: 1px solid var(--po-de);
  display: flex;
  justify-content: center;
  align-items: center;
`
export default MemberPage