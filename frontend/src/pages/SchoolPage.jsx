import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { Navigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SchoolPage = () => {
  const { user, role } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [skills, setSkills] = useState([]);

  //  Block unauthorized access
  if (!user || role !== "school") return <Navigate to="/" />;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/school/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      alert("Could not load student list.");
    }
  };

  const fetchSkills = async (studentId) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/school/student/${studentId}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedStudentId(studentId);
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      alert("Could not load skills.");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      const token = await user.getIdToken();
      await axios.delete(`${BASE_URL}/skill/delete/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Skill deleted.");
      fetchSkills(selectedStudentId);
    } catch (error) {
      console.error("Failed to delete skill:", error);
      alert("Could not delete skill.");
    }
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <p>Welcome, {user?.email}</p>
      <p>Role: {role}</p>
      <button onClick={() => signOut(auth)}>Logout</button>

      <h3>Your Students</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.email} ({student.customUid})
            <button onClick={() => fetchSkills(student.id)}>View Skills</button>
          </li>
        ))}
      </ul>

      {selectedStudentId && (
        <div>
          <h4>Skills of Student ID: {selectedStudentId}</h4>
          <ul>
            {skills.map((skill) => (
              <li key={skill.id}>
                <strong>{skill.title}</strong> ({skill.level})<br />
                <em>{skill.description}</em><br />
                <button onClick={() => handleDeleteSkill(skill.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SchoolPage;