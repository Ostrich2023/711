import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getSchoolStudents(token) {
  const res = await axios.get(`${BASE_URL}/school/students`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getStudentSkillsBySchool(token, studentId) {
  const res = await axios.get(`${BASE_URL}/school/student/${studentId}/skills`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
