import { Menu, ActionIcon, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconWorld } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const changeLang = async (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);

    // 如果用户已登录，将语言同步写入 Firestore
    if (user?.uid) {
      try {
        await updateDoc(doc(db, "users", user.uid), { language: lang });
      } catch (err) {
        console.warn("Failed to update language:", err.message);
      }
    }
  };

  return (
    <Menu shadow="md" width={140} position="bottom-end">
      <Menu.Target>
        <Tooltip label="Language">
          <ActionIcon variant="subtle" radius="xl" size="lg">
            <IconWorld size={20} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => changeLang("en")}>🇬🇧 English</Menu.Item>
        <Menu.Item onClick={() => changeLang("zh")}>🇨🇳 中文</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

