import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import i18n from "../i18n"; // 多语言支持

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap.exists()) {
            const data = snap.data();

            setRole(data.role || null);

            // 主题设置（同步到 localStorage 供 Mantine 使用）
            if (data.theme) {
              localStorage.setItem("mantine-color-scheme", data.theme);
            }

            // 语言设置
            if (data.language) {
              i18n.changeLanguage(data.language);
            }
          }
        } catch (err) {
          console.warn("Failed to fetch user preferences:", err.message);
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
