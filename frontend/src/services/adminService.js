import axios from "../utils/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllUsers(token) {
  const res = await axios.get(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateUserRole(token, uid, role) {
  return axios.put(`${BASE_URL}/admin/user/${uid}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteUser(token, uid) {
  return axios.delete(`${BASE_URL}/admin/user/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
