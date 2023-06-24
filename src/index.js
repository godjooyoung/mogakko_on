import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import store from './redux/config/configStore';
import { QueryClient } from "react-query"
import { QueryClientProvider } from "react-query"

const root = ReactDOM.createRoot(document.getElementById('root'));
// const queryClient = new QueryClient()
// axios.defaults.withcredentials = true;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
    });
    // 화면 탭 변경시 재 조회 설정을 기본 true에서 false로 바꾸는 옵션
root.render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <App />
        </Provider>
    </QueryClientProvider>
);
