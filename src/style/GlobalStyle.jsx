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
    --h-l-f-om-o: 4px;
    --go-h-jh-l: 8px;
    --i-g-gvoq: 12px;
    --g-ki-r-rq: 16px;
    --j-mdfu-h: 20px;
    --jx-b-v-zt: 0 8px 28px rgba(0,0,0,0.28);
    --g-r-n-ycy: 1px solid rgba(0,0,0,0.04);
    --ih-jiz-p: 0 6px 20px rgba(0,0,0,0.2);
    --cglwe-y: 1px solid rgba(0,0,0,0.04);
    --cizosd: 0 6px 16px rgba(0,0,0,0.12);
    --cb-k-zk-c: 1px solid rgba(0,0,0,0.04);
    --e-swdx-p: 0 2px 4px rgba(0,0,0,0.18);
    --g-fi-y-r-e: 1px solid rgba(0,0,0,0.08);
    --itr-yy-z: cubic-bezier(0.2,0,0,1);
    --c-wky-h-p: 1px;
    --hzee-ha: 175px;
    --gracgr: 26px;
    --e-usyia: cubic-bezier(0.1,0.9,0.2,1);
    --hb-n-kc-m: 1px;
    --ikro-f: 300px;
    --h-m-d-zo-y: 35px;
    --f-w-xhiy: cubic-bezier(0.4,0,1,1);
    ---sof-io: 1px;
    --cll-sox: 300px;
    --kf-r-nu-y: 35px;
    --inwig-v: 1px;
    --ien-u-go: 250px;
    --d-kmbxx: 22px;
    --j-cm-lxz: cubic-bezier(0,0,1,1);
    --f-ya-ggj: cubic-bezier(1,0,0.86,1);
    --bd-d-m-c-q: cubic-bezier(0,0,0.1,1);
    ---bz-mmq: cubic-bezier(0.35,0,0.65,1);
    --bgxgx: #000000;
    --f-k-smk-x: #222222;
    --fo-jk-r-s: #717171;
    --iw-ihca: #B0B0B0;
    --j-qkgmf: #DDDDDD;
    --d-nc-lt-s: #EBEBEB;
    ---pc-g-v-g: #F7F7F7;
    --f-mkcy-f: #FFFFFF;
    --k-va-tnc: #C13515;
    --cnr-vp-o: #B32505;
    --f-p-k-v-lb: #FFF8F6;
    --fhi-qn-u: #E07912;
    --k-ff-my-a: #008A05;
    --ldbkp-d: #428BFF;
    --ihf-tp-q: #FF385C;
    --cl-yygv: #E00B41;
    --kd-lqtg: #92174D;
    --d-u-w-o-m-k: #460479;
    --dc-gy-f-v: linear-gradient(to right,#E61E4D 0%,#E31C5F 50%,#D70466 100%);
    --bb-gov-t: linear-gradient(to left,#E61E4D 0%,#E31C5F 50%,#D70466 100%);
    --d-e-vybb: radial-gradient(circle at center,#FF385C 0%,#E61E4D 27.5%,#E31C5F 40%,#D70466 57.5%,#BD1E59 75%,#BD1E59 100%);
    --gj-z-dpd: linear-gradient(to right,#BD1E59 0%,#92174D 50%,#861453 100%);
    --fb-hdaf: linear-gradient(to left,#BD1E59 0%,#92174D 50%,#861453 100%);
    --i-n-t-h-mj: radial-gradient(circle at center,#D70466 0%,#BD1E59 30%,#92174D 55%,#861453 72.5%,#6C0D63 90%,#6C0D63 100%);
    --iqds-nv: linear-gradient(to right,#59086E 0%,#460479 50%,#440589 100%);
    --dy-k-qzx: linear-gradient(to left,#59086E 0%,#460479 50%,#440589 100%);
    --j-m-v-dtd: radial-gradient(circle at center,#6C0D63 0%,#59086E 30%,#460479 55%,#440589 72.5%,#3B07BB 90%,#3B07BB 100%);
    --jhzm-v-t: 16px;
    --ikx-k-pe: 24px;
    --kksqe-v: 32px;
    --f-fw-z-a-i: 40px;
    --cw-a-a-u-a: 48px;
    --fvsvry: 64px;
    --cy-o-aco: 80px;
    --d-b-mrdy: 2px;
    --h-x-sf-jw: 4px;
    --fgg-f-l-a: 8px;
    --b-y-unon: 12px;
    --jaa-ni-h: 16px;
    --ic-zlb-s: 24px;
    --kc-t-qr-j: 32px;
    --e-ls-qkw: 'Circular',-apple-system,'BlinkMacSystemFont','Roboto','Helvetica Neue',sans-serif;
    --fy-rs-ca: 18px;
    --d-ar-t-o-n: 22px;
    --lhy-d-yl: 22px;
    --fme-bf-w: 26px;
    --g-zgv-nj: 26px;
    --b-x-z-q-l-e: 30px;
    --cv-p-u-ui: 32px;
    --hu-t-o-g-n: 36px;
    --hr-k-udr: 10px;
    --dpgw-ac: 12px;
    --f-cv-j-j-p: 12px;
    --f-l-h-bac: 16px;

    --c-zdwk-p: 14px;
    --j-p-z-kco: 18px;
    --i-nh-zme: 14px;
    --gvarj-f: 20px;
    --iw-ehf-f: 16px;
    ---s-l-myu: 20px;
    --y-g-ar-y: 16px;
    --cb-pewj: 24px;
    --ll-l-ys-f: 18px;
    --f-xgviq: 24px;
    --kmwb-ss: 18px;
    --j-n-c-d-l-h: 28px;
    --jlvl-j-l: 12px;
    --j-l-x-t-kw: 16px;
    --e-y-j-d-v-j: 400;
    --jx-zk-pv: 600;
    --h-oqhch: 800;
    --g-lm-u-p: normal;
    --mq-yk-l: 0.04em;
    }
`;

export default GlobalStyle;