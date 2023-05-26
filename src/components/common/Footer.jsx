import React from 'react';
import { styled } from 'styled-components';

function Footer(props) {
    return (
        <CommonFooter>
            푸터입니다.
        </CommonFooter>
    );
}

export const CommonFooter = styled.footer`
    background: hotpink;
    width : 100vw;
    height : 50px;
`
export default Footer;