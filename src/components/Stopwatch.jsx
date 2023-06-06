import React from 'react';
import { useState } from 'react';
import { styled } from 'styled-components';
import useInterval from '../hooks/useInterval';
function Stopwatch(props) {

    const stopStopWatch = () => {
        console.log("타이머 끝난다")
    }
    const startStopWatch = () => {
        console.log("타이머 시작한다.")
        setIsStart(!isStart)
    }

    const [isStart, setIsStart] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [mins, setMins] = useState(0)
    const [times, setTimes] = useState(0)

        
        useInterval(()=>{
            if(isStart){
                setSeconds(seconds+1)
                if(seconds === 59){
                    setSeconds(0)
                    setMins(mins+1)
                }
            }
        },1000)

    

    return (
        <div>
            <Timer>00:{mins}:{seconds>9?seconds:'0'+seconds}</Timer>
            <button onClick={()=>{startStopWatch(isStart)}}>start</button>
            <button onClick={startStopWatch}>stop</button>
        </div>
    );
}
export const Timer = styled.div`
    font-size: xx-large;
    color: white;
`
export default Stopwatch;