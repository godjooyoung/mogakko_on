import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

/* [

[
{languageEnum: 'JAVA', percentage: 21.71}
{languageEnum: 'KOTLIN', percentage: 21.71}
{languageEnum: 'C++', percentage: 23.68}
{languageEnum: 'PYTHON', percentage: 15.79}
{languageEnum: 'C#', percentage: 15.79}
{languageEnum: 'C', percentage: 17.11}
{languageEnum: 'JAVASCRIPT', percentage: 4.61}
{languageEnum: 'ETC', percentage: 0.66}
]
*/

ChartJS.register(ArcElement, Tooltip, Legend);
function ChartLan(props) {

    useEffect(() => {
        // 초기
        console.log("ChartLan :: ", props.data)
        return () => {
            // 클린
        }
    }, [])

    useEffect(() => {
        if (props.data) {
            // console.log("ChartLan2 :: ", props.data)
            // const dataObject = props.data;
            // const sortedArray = dataObject
            //     .sort((a, b) => {
            //         const langs = ['JAVA', 'PYTHON', 'JAVASCRIPT', 'C', 'C#', 'C++', 'KOTLIN', 'ETC']
            //         return langs.indexOf(a.languageEnum) - langs.indexOf(b.languageEnum)
            //     })
            //     .map(entry => entry.percentage)

            // console.log(".............>>>>>", sortedArray)

            console.log("ChartLan2 :: ", props.data);
            const dataObject2 = props.data;
            const langs2 = ['JAVA', 'PYTHON', 'JAVASCRIPT', 'C', 'C#', 'C++', 'KOTLIN', 'ETC'];

            const resultArray2 = langs2.map(lang => {
                const foundData2 = dataObject2.find(item => item.languageEnum === lang);
                return foundData2 ? foundData2.percentage : 0;
            });

            console.log(".............>>>>><<<<<<>>>>>", resultArray2);


            setChartData((prevChartData) => ({
                ...prevChartData,
                datasets: [
                    {
                        ...prevChartData.datasets[0],
                        data: resultArray2,
                    },
                ],
            }));
        }
    }, [props])


    const options = {
        plugins: {
            legend: {
                display: true,
                position : 'left',
                labels : {
                    boxWidth : 33,
                    boxHeight : 13,
                    font: {
                        size: 12
                    },
                    color : '#ffffff'
                }
            }
        }
    }

    const [chartData, setChartData] = useState({
        labels: ['JAVA', 'PYTHON', 'JAVASCRIPT', 'C', 'C#', 'C++', 'KOTLIN', 'ETC'],
        datasets: [
            {
                label: '참여도 ',
                data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                backgroundColor: [
                    'rgba(233, 64, 70, 0.2)',
                    'rgba(47, 145, 231, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(47, 145, 231, 0.2)',
                    'rgba(143, 95, 232, 0.2)',
                    'rgba(109, 211, 94, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(98, 104, 115, 0.2)',
                ],
                borderColor: [
                    'rgba(233, 64, 70, 1)',
                    'rgba(47, 145, 231, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(47, 145, 231, 1)',
                    'rgba(143, 95, 232, 1)',
                    'rgba(109, 211, 94, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(98,104,115, 1)',
                ],
                hoverBackgroundColor: [
                    'rgba(233, 64, 70, 0.8)',
                    'rgba(47, 145, 231, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(47, 145, 231, 0.8)',
                    'rgba(143, 95, 232, 0.8)',
                    'rgba(109, 211, 94, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(98,104,115, 0.8)',
                ],
                borderWidth: 1,
            },
        ],
        position: 'left',
    })

    return (
        <ChartWrap>
            <Doughnut data={chartData} options={options} />
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