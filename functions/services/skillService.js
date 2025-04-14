import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function addSkill(token, skillData) {
  return axios.post(`${BASE_URL}/skill/add`, skillData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listSkills(token) {
  const res = await axios.get(`${BASE_URL}/skill/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteSkill(token, skillId) {
  return axios.delete(`${BASE_URL}/skill/delete/${skillId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
