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
            tooltip: { // 툴팁 속성 설정
                backgroundColor: 'white',
                titleColor: 'rgba(225,116,103)',
                bodyColor: 'rgba(0,0,0)',
                caretSize: 0,
                boxWidth: '100px',
                borderColor: 'rgba(225,116,103)',
                borderWidth: 1,
            },
        },
        scales: {
            y: { // defining min and max so hiding the dataset does not change scale range
                min: 0,
                max: 10,
                ticks: {
                    font: {
                      size: 12, // Specify the font size for the scale ticks
                    },
                    color: '#ffffff', // Specify the font color for the scale ticks
                },
            },
            x: { // defining min and max so hiding the dataset does not change scale range
                ticks: {
                    font: {
                      size: 12, // Specify the font size for the scale ticks
                    },
                    color: '#ffffff', // Specify the font color for the scale ticks
                },
            }
        },

    };

    const labels = ['월', '화', '수', '목', '금', '토', '일'];

    const data = {
        labels: labels,
        datasets: [{
            data: [10.0, 12.0, 2.5, 0.8, 12.0, 10.0, 10.0],
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
    width: 100% ;
    /* width: 446px; */
    height: 168px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default ChartTimes;