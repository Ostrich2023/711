import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

// Pages
import { AuthenticationImage } from './pages/login/AuthenticationImage';
import { AuthenticationTitle } from './pages/register/AuthenticationTitle';

import StudentPage from "./pages/StudentPage";
import StudentProfile from "./pages/StudentProfile";
import SchoolPage from "./pages/SchoolPage";
import EmployerPage from "./pages/EmployerPage";
import AdminPage from "./pages/AdminPage";
import SyncUserDocPage from "./pages/SyncUserDocPage";
import RedirectByRole from "./components/RedirectByRole";

function App() {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthenticationTitle />} />
          <Route path="/register" element={<AuthenticationTitle />} />
          <Route path="/login" element={<AuthenticationImage />} />
          <Route
            path="/student"
            element={role === "student" ? <StudentPage /> : <Navigate to="/" />}
          />
          <Route
            path="/student/profile"
            element={role === "student" ? <StudentProfile /> : <Navigate to="/" />}
          />
          <Route
            path="/school"
            element={role === "school" ? <SchoolPage /> : <Navigate to="/" />}
          />
          <Route
            path="/employer"
            element={role === "employer" ? <EmployerPage /> : <Navigate to="/" />}
          />
          <Route
            path="/admin"
            element={role === "admin" ? <AdminPage /> : <Navigate to="/" />}
          />
          <Route path="/sync" element={<SyncUserDocPage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;