
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../firebase";

export function listenForTokenRefresh() {
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  });
}
