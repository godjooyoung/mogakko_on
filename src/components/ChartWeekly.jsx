import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';

function ChartWeekly(props) {
    const [weeklyAttend, setWeeklyAttend] = useState([10.0, 0, 0, 0, 0, 0, 0])
    const [wkTotTm, setWkTotTm] = useState('00H00M')
    useEffect(() => {
        // 초기화
        console.log("ChartWeekly :: ", props.data)
        return () => {
            // 클린
        }
    }, [])

    useEffect(() => {
        if (props.data) {
            console.log("ChartWeekly2 :: ", props.data)

            const dataObject = props.data
            const dataArray = Object.entries(dataObject).sort((a, b) => {
                // 주어진 요일 순서대로 정렬하기 위해 숫자로 변환하여 비교
                const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                return weekdays.indexOf(a[0]) - weekdays.indexOf(b[0]);
            }).map((entry) => entry[1]).slice(1)

            console.log(".............>>", dataArray);
            setWeeklyAttend((prevWeeklyAttend)=>dataArray)
            setWkTotTm(props.data.weekTotal)
        }
    }, [props])

    const dayWkNmHandler = (idx) => {
        let wkNm = ''
        switch (idx) {
            case 0:
                wkNm = '월'
                break;
            case 1:
                wkNm = '화'
                break;
            case 2:
                wkNm = '수'
                break;
            case 3:
                wkNm = '목'
                break;
            case 4:
                wkNm = '금'
                break;
            case 5:
                wkNm = '토'
                break;
            case 6:
                wkNm = '일'
                break;
        }
        return wkNm
    }

    return (
        <Wrap>
            <ChartWeelkyWrap>
                <AttendancesWrap>
                    {weeklyAttend.map((dayWk, idx) => {
                        return (
                            <AttendanceDiv>
                                <DayWk>{dayWkNmHandler(idx)}</DayWk>
                                <EllipseDiv isAttend={dayWk} />
                            </AttendanceDiv>
                        )
                    })}
                    <WkTotWrap>
                        <WkTotTmTitle>TOTAL</WkTotTmTitle>
                        <WkTotTm>{wkTotTm}</WkTotTm>
                    </WkTotWrap>

                </AttendancesWrap>
            </ChartWeelkyWrap>
        </Wrap>
    );
}

export const Wrap = styled.div`
    display: flex;
    justify-content: center;    
`
export const ChartWeelkyWrap = styled.div`
    display: flex;
    gap: 26px;
    align-items: center;
    width: 446px;
    height: 118px;

`
export const WkTotWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 113px;
    height: 46px;
`
export const WkTotTmTitle = styled.h1`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    color: #FFFFFF;
`
export const WkTotTm = styled.h2`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 28px;
    color: #FFFFFF;
`
export const AttendancesWrap = styled.div`
    display: flex;
    gap: 23px;
    align-items:center;
`

export const AttendanceDiv = styled.div`
    width: 24px;
    height: 46px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`
export const DayWk = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;   
    font-size: 11px;
    text-align: center;
    color: #FFFFFF;
    width: 15px;
    height: 13px;
    left: 5px;
    top: 52px;
`
export const EllipseDiv = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    background-color : ${(props) => {
        return Number(props.isAttend) > 0 ? 'var(--po-de)' : '#BEBEBE'
    }};
    background-image: ${(props) =>
        Number(props.isAttend) > 0 ? `url(${process.env.PUBLIC_URL}/image/wkDayAtte.webp)` : 'none'
    };
    background-position: center;
    background-repeat: no-repeat;
`
export default ChartWeekly;