import axios from "../utils/axiosInstance";

// Add new skill
export async function addSkill(token, skillData) {
  return axios.post("/skill/add", skillData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// List all skills for the current user
export async function listSkills(token) {
  const res = await axios.get("/skill/list", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Delete a skill by its ID
export async function deleteSkill(token, skillId) {
  return axios.delete(`/skill/delete/${skillId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Update a skill (future use)
export async function updateSkill(token, skillId, updates) {
  return axios.put(`/skill/update/${skillId}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
