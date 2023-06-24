import React, { useEffect } from 'react';
import { styled } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SnackBar(props) {
    useEffect(() => {
        showToast();
    }, [props.status]);

    const showToast = () => {
        toast(props.content);
    };
    return (
        <>
            <StyledContainer
                position="top-center"
                autoClose='1200'
                pauseOnFocusLoss
                draggable
                pauseOnHover='false'
                hideProgressBar='true'
            />
        </>
    );
}
const StyledContainer = styled(ToastContainer)`
  // https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
    &&&.Toastify__toast-container {
        
    }
    .Toastify__toast {
        border-radius: 5px;
        background: #FFFFFF;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.63);
        color: #000;
        font-size: 13px;
        font-family: 'Pretendard';
        padding: 8px 0px 8px 23px;
        width: 273px;
        height: 40px;
        min-height: 40px;

    }
    .Toastify__close-button {
        visibility: hidden;
    }
    .Toastify__toast-body {
        margin: 0;
        padding: 0;
    }
    .Toastify__progress-bar {
    }
`;
export default SnackBar;