import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartTimes(props) {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: `Week's Study Time`,
            },
        },
        scales: {
            width: 496,
            height: 187,
            y: { // defining min and max so hiding the dataset does not change scale range
                min: 0,
                max: 60
            }
        },

    };

    const labels = ['월', '화', '수', '목', '금', '토', '일'];

    const data = {
        labels: labels,
        datasets: [{
            data: [0.0, 0.0, 0.5, 0.8, 0.0, 0.0, 0.0],
            backgroundColor: [
                'rgba(0, 240, 255, 0.2)',
                'rgba(0, 240, 255, 0.2)',
                'rgba(0, 240, 255, 0.2)',
                'rgba(0, 240, 255, 0.2)',
                'rgba(0, 240, 255, 0.2)',
                'rgba(0, 240, 255, 0.2)',
                'rgba(0, 240, 255, 0.2)'
            ],
            borderColor: [
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)'
            ],
            hoverBackgroundColor: [
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)',
                'rgb(0, 240, 255)'
            ],                  // 호버시 막대 컬러
            borderWidth: 1,     // 막대바 테두리
            barPercentage: 0.7, // 막대바 폭
        }]
    }

    useEffect(() => {
        console.log("ChartTimes :: ", props.data)
        return () => {
            //클린
        }
    }, [])

    // 데이터 세팅
    useEffect(() => {
        if (props.data) {
            console.log("ChartTimes2 :: ", props.data)
        }
    }, [props])


    return (
        <ChartWrap>
            <Bar options={options} data={data} />
        </ChartWrap>
    );
}

const ChartWrap = styled.div`
    width: 446px;
    height: 168px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default ChartTimes;