import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getUserInfo(token) {
  const res = await axios.get(`${BASE_URL}/user/info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
