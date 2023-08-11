import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import './App.css';
import Router from './shared/Router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { accessToken } from './components/Header';

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
