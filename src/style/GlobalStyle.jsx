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
    
    @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}
    :root {
    --h-l-f-om-o: 4px;
    --go-h-jh-l: 8px;
    --g-fi-y-r-e: 1px solid rgba(0,0,0,0.08);
    --itr-yy-z: cubic-bezier(0.2,0,0,1);
    --bgxgx: #000000;
    --f-k-smk-x: #222222;
    --fo-jk-r-s: #717171;
    --e-ls-qkw: 'Circular',-apple-system,'BlinkMacSystemFont','Roboto','Helvetica Neue',sans-serif;
    --g-lm-u-p: normal;
    --mq-yk-l: 0.04em;
    }
`;

export default GlobalStyle;