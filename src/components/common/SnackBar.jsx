import React, { useEffect } from 'react';
import { styled } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SnackBar(props) {
    useEffect(() => {
        showToast();
    }, [props.status]);

    const showToast = () => {
        toast.error(props.content);
    };
    return (
        <>
            <ToastContainer
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

export default SnackBar;