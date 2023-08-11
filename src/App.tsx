import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import './App.css';
import Router from './shared/Router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { accessToken } from './components/Header';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 윈도우가 다시 포커스되었을때 데이터를 호출할 것인지
      retry: 1 // API 요청 실패시 재시도 하는 옵션 (설정값 만큼 재시도)
    }
  }
});

function App() {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user || !accessToken) navigate('/login');
      setRender(true);
    });
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
