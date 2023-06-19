import React from 'react';
import { styled } from 'styled-components';

function SnackBar(props) {
    return (
        <SnackBarWrap>
            <p>쪽지가 전송되었습니다.</p>
        </SnackBarWrap>
    );
}

export const SnackBarWrap = styled.div`
    width: 273px;
    height: 40px;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.63);
    border-radius: 5px;
    p {
        color: #000000;
    }
`
export default SnackBar;