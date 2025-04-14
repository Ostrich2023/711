import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectByRole />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
    </BrowserRouter>
  );
}

export default App;