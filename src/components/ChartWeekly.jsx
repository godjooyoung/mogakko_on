import React, { useEffect, useState } from 'react';

function ChartWeekly(props) {

    useEffect(()=>{
        // 초기화
        console.log("ChartWeekly :: ",props.data)
        return () => {
            // 클린
        }
    },[])

    useEffect(()=>{
        // 초기
        console.log("ChartWeekly2 :: ",props.data)
    },[props])
    
    return (
        <div>
        </div>
    );
}

export default ChartWeekly;