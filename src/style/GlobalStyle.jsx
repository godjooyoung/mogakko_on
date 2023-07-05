import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {margin: 0; padding: 0;}
    *, *:before, *:after{box-sizing: border-box;}
    html{overflow-y: scroll;}
    body{min-width: 320px;}
    li{list-style: none;}
    a{text-decoration: none; color: inherit;}
    img{border: 0; vertical-align: middle;}
    fieldset{border: none;}
    input, select, button, textarea{vertical-align: middle;}
    button, input[type=button], input[type=image]{cursor: pointer;}
    .blind,legend{position: absolute; left: -9999px;}
    table{border-collapse: collapse;}
    caption{text-indent: -9999px; height: 0; overflow: hidden; font-size: 0;} 
    strong,em,address,th{font-weight: normal; font-style: normal;}
    h1,h2,h3,h4,h5,h6{font-weight: normal; font-size: 100%;}
    .skipmenu a{background: #000; color: #fff; position: absolute; left: 0; top: -500px; width: 100%; text-align: center; padding: 8px 0;z-index: 9999;}
    .skipmenu a:focus{top: 0;}
    button{cursor: pointer;}
    img, video{max-width: 100%}
    
    :root {
    --bg-de : #010D25;                   //배경색 1
    --bg-de-rgba : rgb(1, 13, 37);       //배경색 1 - rgb
    --bg-li : #161f36;                   //배경색 2
    --po-de : #00F0FF; // 주요색
    --ft-bk : #464646; // 밝은 배경 글자색
    --ft-li : #FFFFFF; // 검은 배경 글자색
    
    }
`;

export default GlobalStyle;