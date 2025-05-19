import { createBrowserRouter } from 'react-router-dom';

// Layout
import Layout from '../components/layout/Layout';

// General pages
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UnauthorizedPage from '../pages/Unauthorized';
import WhyKanavoogle from '../pages/WhyKanavoogle';
import ErrorPage from '../pages/ErrorPage';

// Student
import StudentPage from "../pages/student/StudentPage";
import StudentHome from '../pages/student/StudentHome';
import StudentRequestSkill from '../pages/student/StudentRequestSkill';
import DigitalSkillWallet from '../pages/student/DigitalSkillWallet';

// School
import SchoolPage from "../pages/school/SchoolPage";
import SchoolHome from '../pages/school/SchoolHome';
import SchoolVerifySkill from '../pages/school/SchoolVerifySkill';
import SchoolCourseManager from '../pages/school/SchoolCourseManager'; 

// Employer
import EmployerPage from "../pages/employer/EmployerPage";
import EmployerHome from '../pages/employer/EmployerHome';
import JobManagement from '../pages/employer/JobManagement';
import EmployerMessagesPage from '../pages/employer/EmployerMessagesPage';
import EmployerStudentsList from '../pages/employer/EmployerStudentsList';

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

      // Student routes
      {
        path: "student",
        element: <StudentPage />,
        children: [
          { index: true, element: <StudentHome /> },
          { path: "request-skill", element: <StudentRequestSkill /> },
        ]
      },

      { path: "digital-skill-wallet", element: <DigitalSkillWallet /> },

      // School routes
      {
        path: "school",
        element: <SchoolPage />,
        children: [
          { index: true, element: <SchoolHome /> },
          { path: "verify-skill", element: <SchoolVerifySkill /> },
          { path: "manage-courses", element: <SchoolCourseManager /> }, 
        ]
      },

      // Employer routes
      {
        path: "employer",
        element: <EmployerPage />,
        children: [
            { index: true, element: <EmployerHome /> },
            { path: "request-skill", element: <JobManagement /> },
            { path: "messages", element: <EmployerMessagesPage /> },
            { path: "students-list", element: <EmployerStudentsList /> },
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
