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
import JobDetail from '../pages/student/JobDetail'; 
import MyJobApplications from '../pages/student/MyJobApplications'; 

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
import EmployerApplications from '../pages/employer/EmployerApplications'
import EmployerSettings from '../pages/employer/EmployerSettings';

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
        { path: "jobs/:jobId", element: <JobDetail /> },           // 新增职位详情页
        { path: "my-applications", element: <MyJobApplications /> } // 新增我的申请页
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
      { path: "settings", element: <SchoolSettings /> }, // 现在不会跳 ErrorPage 了
    ]
  },  

      // Employer routes
      {
        path: "employer",
        element: <EmployerPage />,
        children: [
          { index: true, element: <EmployerHome /> },
          { path: "request-skill", element: <JobManagement /> },
          { path: "applications", element: <EmployerApplications /> },
          { path: "settings", element: <EmployerSettings /> } // 添加 settings 页面
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
