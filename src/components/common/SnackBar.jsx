import React from 'react';
import { styled } from 'styled-components';

function SnackBar(props) {
    const topPos = props.topPos
    const lefePos = props.lefePos
    const msg = props.msg
    return (
        <SnackBarWrap>{msg}</SnackBarWrap>
    );
}

export const SnackBarWrap = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    width: 273px;
    height: 40px;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.63);
    border-radius: 5px;
    position: absolute;
    /* TODO 전체 레이아웃 바뀌면 다시 조정해야함. */
    top: 813px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 23px;
    display: flex;
    align-items: center;
`
export default SnackBar;