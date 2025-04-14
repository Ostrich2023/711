import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { Navigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminPage = () => {
  const { user, role } = useAuth();
  const [users, setUsers] = useState([]);

  //  Block unauthorized access
  if (!user || role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to load user list.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {role}</p>
      <button onClick={() => signOut(auth)}>Logout</button>

      <h3>All Registered Users</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>School</th>
            <th>UID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.schoolId || "-"}</td>
              <td>{u.customUid || u.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;