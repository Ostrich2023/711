import {createBrowserRouter} from 'react-router-dom';

// Pages
import Layout from '../components/layout/Layout';

import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UnauthorizedPage from '../pages/Unauthorized';

import StudentPage from "../pages/StudentPage";
import StudentProfile from "../pages/StudentProfile";
import SchoolPage from "../pages/SchoolPage";
import EmployerPage from "../pages/EmployerPage";
import AdminPage from "../pages/AdminPage";
import SyncUserDocPage from "../pages/SyncUserDocPage";
import RedirectByRole from "../components/auth/RedirectByRole";

import ErrorPage from '../pages/ErrorPage';
import SchoolHome from '../pages/SchoolHome';
import SchoolVerifySkill from '../pages/SchoolVerifySkill';
import SchoolPublishCertification from '../pages/SchoolPublishCertification';
import SchoolStudents from '../pages/SchoolStudents';
import SchoolCourses from '../pages/SchoolCourses';

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {index: true, element: <HomePage />},
      {path: "register", element: <Register />},
      {path: "login", element: <Login />},
      {path: "unauthorized", element: <UnauthorizedPage />},

      // Role pages
      {path: "school",
       element: <SchoolPage />,
       children: [
        {index: true, element: <SchoolHome />},
        {path: "verify-skill", element: <SchoolVerifySkill />},
        {path: "publish-certification", element: <SchoolPublishCertification />},
        {path: "students", element: <SchoolStudents />},
        {path: "courses", element: <SchoolCourses />},
       ]},

      {path: "student", element: <StudentPage />},
      {path: "student/profile", element: <StudentProfile />},
      
      {path: "employer", element: <EmployerPage />},
      {path: "admin", element: <AdminPage />},
      {path: "sync", element: <SyncUserDocPage />},
      {path: "redirect", element: <RedirectByRole />},

      // 404 fallback
      {path: "*", element: <ErrorPage />}
    ]
  }
]);

export default AppRouter;