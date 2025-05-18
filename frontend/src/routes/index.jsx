import { createBrowserRouter } from 'react-router-dom';

// Layout
import Layout from '../components/layout/Layout';

// General pages
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UnauthorizedPage from '../pages/Unauthorized';
import WhyKanavoogle from '../pages/WhyKanavoogle';
import Services from '../pages/Services'
import ErrorPage from '../pages/ErrorPage';


// Student
import StudentPage from "../pages/student/StudentPage";
import StudentHome from '../pages/student/StudentHome';
import StudentRequestSkill from '../pages/student/StudentRequestSkill';
import StudentSettings from '../pages/student/StudentSettings';
import DigitalSkillWallet from '../pages/student/DigitalSkillWallet';
import StudentProfile from '../pages/student/StudentProfile';

// School
import SchoolPage from "../pages/school/SchoolPage";
import SchoolHome from '../pages/school/SchoolHome';
import SchoolVerifySkill from '../pages/school/SchoolVerifySkill';
import SchoolCourseManager from '../pages/school/SchoolCourseManager'; 
import SchoolSettings from '../pages/school/SchoolSettings';

// Employer
import EmployerPage from "../pages/employer/EmployerPage";
import EmployerHome from '../pages/employer/EmployerHome';
import JobManagement from '../pages/employer/JobManagement';

// Admin
import AdminPage from "../pages/AdminPage";
import SyncUserDocPage from "../pages/SyncUserDocPage";


const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "unauthorized", element: <UnauthorizedPage /> },
      { path: "why-kanavoogle", element: <WhyKanavoogle /> },
      { path: "services", element: <Services /> },

      // Student routes
      {
        path: "student",
        element: <StudentPage />,
        children: [
          { index: true, element: <StudentHome /> },
          { path: "profile", element: <StudentProfile /> },
          { path: "request-skill", element: <StudentRequestSkill /> },
          { path: "settings", element: <StudentSettings /> },
          { path: "wallet", element: <DigitalSkillWallet /> },
        ]
      },

      // School routes
  {
    path: "school",
    element: <SchoolPage />,
    children: [
      { index: true, element: <SchoolHome /> },
      { path: "verify-skill", element: <SchoolVerifySkill /> },
      { path: "manage-courses", element: <SchoolCourseManager /> }, 
      { path: "settings", element: <SchoolSettings /> }, // ✅ 现在不会跳 ErrorPage 了
    ]
  },  

      // Employer routes
      {
        path: "employer",
        element: <EmployerPage />,
        children: [
            { index: true, element: <EmployerHome /> },
            { path: "request-skill", element: <JobManagement /> },
        ]
      },

      // Admin & Utility
      { path: "admin", element: <AdminPage /> },
      { path: "sync", element: <SyncUserDocPage /> },

      // Fallback
      { path: "*", element: <ErrorPage /> }
    ]
  }
]);

export default AppRouter;
