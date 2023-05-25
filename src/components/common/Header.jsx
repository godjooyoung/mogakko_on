import React from 'react';
import { styled } from 'styled-components';

function Header(props) {
    return (
        <CommonHeader>
            헤더입니다.
        </CommonHeader>
    );
}

export const CommonHeader = styled.header`
    background: purple;
    color : white;
    width : 100vw;
    height : 50px;
`
export default Header;