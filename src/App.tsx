import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import './App.css';
import Router from './shared/Router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { getReturnedParamsFromSpotifyAuth } from './api/accesstoken';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem('access_token');
  useEffect(() => {
    if (window.location.hash) {
      //잘라버리는 작업을 수행합니다.
      const { access_token } = getReturnedParamsFromSpotifyAuth(window.location.hash);
      sessionStorage.setItem('access_token', access_token);
      navigate('/');
      window.location.reload();
    }
    onAuthStateChanged(auth, (user) => {
      if (!user || !accessToken) navigate('/login');
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
