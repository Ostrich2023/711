import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { Navigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EmployerPage = () => {
  const { user, role } = useAuth();
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [skills, setSkills] = useState([]);

  // ❗ Block unauthorized access
  if (!user || role !== "employer") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchSchoolList();
  }, []);

  const fetchSchoolList = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/employer/schools`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchools(res.data);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      alert("Could not load school list");
    }
  };

  const fetchStudents = async (schoolId) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/employer/school/${schoolId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedSchool(schoolId);
      setStudents(res.data);
      setSelectedStudent(null);
      setSkills([]);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      alert("Could not load students from this school");
    }
  };

  const fetchSkills = async (studentId) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/employer/student/${studentId}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentInfo = students.find((s) => s.id === studentId);
      setSelectedStudent(studentInfo);
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to fetch student skills:", error);
      alert("Could not load skills");
    }
  };

  return (
    <div>
      <h2>Employer Dashboard</h2>
      <p>Welcome, {user?.email}</p>
      <p>Role: {role}</p>
      <button onClick={() => signOut(auth)}>Logout</button>

      <h3>Select School</h3>
      <select
        value={selectedSchool}
        onChange={(e) => fetchStudents(e.target.value)}
      >
        <option value="">-- Select a School --</option>
        {schools.map((school) => (
          <option key={school.code || school} value={school.code || school}>
            {school.name || school}
          </option>
        ))}
      </select>

      {students.length > 0 && (
        <>
          <h3>Students in: {selectedSchool}</h3>
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                {student.email} ({student.customUid})
                <button onClick={() => fetchSkills(student.id)}>View Skills</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedStudent && (
        <div>
          <h4>Skills of: {selectedStudent.email}</h4>
          <ul>
            {skills.map((skill) => (
              <li key={skill.id}>
                <strong>{skill.title}</strong> ({skill.level})<br />
                <em>{skill.description}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


export default EmployerPage;