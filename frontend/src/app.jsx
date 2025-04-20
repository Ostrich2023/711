
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./context/AuthContext";

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import UnauthorizedPage from './pages/Unauthorized';

import StudentPage from "./pages/StudentPage";
import StudentProfile from "./pages/StudentProfile";
import SchoolPage from "./pages/SchoolPage";
import EmployerPage from "./pages/EmployerPage";
import AdminPage from "./pages/AdminPage";
import SyncUserDocPage from "./pages/SyncUserDocPage";
import RedirectByRole from "./components/RedirectByRole";

function App() {
  const { loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <MantineProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Role Routes */}
            <Route path="/student" element={<StudentPage />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/school" element={<SchoolPage />} />
            <Route path="/employer" element={<EmployerPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/sync" element={<SyncUserDocPage />} />

            {/* Dynamic redirect */}
            <Route path="/redirect" element={<RedirectByRole />} />

            {/* Fallback route */}
            <Route path="*" element={<p>404 Not Found</p>} />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
