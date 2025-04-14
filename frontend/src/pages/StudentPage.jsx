import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { addSkill, listSkills, deleteSkill } from "../services/skillService";
import { useNavigate, Navigate } from "react-router-dom";

const StudentPage = () => {
  const { user, role } = useAuth();
  const [skills, setSkills] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Beginner");
  const navigate = useNavigate();

  //  Block unauthorized access
  if (!user || role !== "student") return <Navigate to="/" />;

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const token = await user.getIdToken();
    const data = await listSkills(token);
    setSkills(data);
  };

  const handleAdd = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required.");
      return;
    }

    const token = await user.getIdToken();
    await addSkill(token, {
      title,
      description,
      level,
      createdAt: new Date().toISOString(),
    });

    setTitle("");
    setDescription("");
    setLevel("Beginner");
    loadSkills();
  };

  const handleDelete = async (skillId) => {
    const token = await user.getIdToken();
    await deleteSkill(token, skillId);
    loadSkills();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Dashboard</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {role}</p>
      <button onClick={() => signOut(auth)}>Logout</button>
      <button onClick={() => navigate("/student/profile")} style={{ marginLeft: "10px" }}>
        Edit Profile
      </button>

      <h3 style={{ marginTop: "30px" }}>Add Skill</h3>
      <input
        placeholder="Skill title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ marginBottom: "10px" }}>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <button onClick={handleAdd}>Submit Skill</button>

      <h3 style={{ marginTop: "30px" }}>Your Skills</h3>
      {skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        <ul>
          {skills.map((skill) => (
            <li key={skill.id} style={{ marginBottom: "10px" }}>
              <strong>{skill.title}</strong> ({skill.level})<br />
              <em>{skill.description}</em><br />
              {skill.verified !== undefined && (
                <span>
                  Verified: {skill.verified ? " Yes" : " No"}<br />
                </span>
              )}
              {skill.score !== undefined && (
                <span>Score: {skill.score}</span>
              )}
              <br />
              <button onClick={() => handleDelete(skill.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentPage;