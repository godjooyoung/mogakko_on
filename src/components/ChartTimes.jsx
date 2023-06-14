import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
const options = {
    responsive: true,
    plugins: {
        legend: {
            display : false,
        },
        title: {
            display: true,
            text: `Week's Study Time`,
        },
    },
};

const labels = ['월', '화', '수', '목', '금', '토', '일'];

const data = {
    labels: labels,
    datasets: [{
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
        ],
        borderWidth: 1
    }]
};


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function ChartTimes(props) {
    return (
        <ChartWrap>
            <Bar options={options} data={data} />
        </ChartWrap>
    );
}

const ChartWrap = styled.div`
    width: 365px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default ChartTimes;