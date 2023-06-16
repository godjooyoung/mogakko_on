import React, { useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';
ChartJS.register(ArcElement, Tooltip, Legend);
export const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
    position: 'bottom',
};


function ChartLan(props) {

    useEffect(()=>{
        // 초기
        console.log("ChartLan :: ",props.data)
        return () => {
            // 클린
        }
    },[])

    useEffect(()=>{
        // 초기
        console.log("ChartLan2 :: ",props.data)
    },[props])
    

    const options = {
        options: {
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgb(255, 99, 132)'
                    }
                }
            }
        },
        position: 'bottom',
    }
    return (
        <ChartWrap>
            <Doughnut data={data} options={options} />
        </ChartWrap>
    );
}

const ChartWrap = styled.div`
    width: 384px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default ChartLan;