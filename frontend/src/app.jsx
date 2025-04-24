
import { RouterProvider } from 'react-router-dom';
import { AuthProvider, useAuth } from "./context/AuthContext";

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import AppRouter from './routes';

function App() {
  const { loading } = useAuth();
  if (loading) return <p>Loading...</p>;

  return (
    <MantineProvider>
      <AuthProvider>
        <RouterProvider router={AppRouter} />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
