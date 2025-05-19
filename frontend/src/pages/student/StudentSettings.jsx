import {
  Box, Title, Switch, Group, Divider, Button, Text,
  Stack, Paper, TextInput, Notification, Select
} from "@mantine/core";
import {
  IconCheck, IconDownload, IconMail, IconEye, IconKey, IconLanguage
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail, updateEmail } from "firebase/auth";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";

export default function StudentSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  const loadSettings = async () => {
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      setEmail(data.email || user.email);
      setNewEmail(data.email || user.email);
      setVisibility(data.visibleToEmployer || false);
      setNotifyEmail(data.notifyByEmail || false);
      setLanguage(data.language || "en");
      setTheme(data.theme || "light");
    }
  };

  const handleSave = async () => {
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      visibleToEmployer: visibility,
      notifyByEmail: notifyEmail,
      language,
      theme,
      email: newEmail,
    });

    if (newEmail !== user.email) {
      try {
        await updateEmail(user, newEmail);
      } catch (err) {
        console.error("Email update failed:", err.message);
        alert("Failed to update email. Please re-authenticate.");
      }
    }

    // 切换语言立即生效
    localStorage.setItem("i18nextLng", language);
    window.location.reload(); // 强制刷新让 i18n 应用主题+语言（可替换为 Context 切换）

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(t("resetSuccess"));
    } catch (err) {
      alert(t("resetFail") + ": " + err.message);
    }
  };

  const handleExportPDF = () => {
    const docPdf = new jsPDF();
    docPdf.text("Digital Skill Wallet Summary", 10, 10);
    docPdf.text(`Email: ${email}`, 10, 20);
    docPdf.text(`Visible to Employers: ${visibility}`, 10, 30);
    docPdf.text(`Language: ${language}`, 10, 40);
    docPdf.save("skill-summary.pdf");
  };

  return (
    <Box mt="xl">
      <Title order={2}>{t("settings")}</Title>

      <Paper withBorder shadow="xs" p="md" mt="md">
        <Stack spacing="md">
          <TextInput
            label={t("email")}
            icon={<IconMail size={16} />}
            value={newEmail}
            onChange={(e) => setNewEmail(e.currentTarget.value)}
          />

          <Group position="apart">
            <Group>
              <IconEye size={18} />
              <Text>{t("publicSkills")}</Text>
            </Group>
            <Switch
              checked={visibility}
              onChange={(e) => setVisibility(e.currentTarget.checked)}
            />
          </Group>

          <Group position="apart">
            <Group>
              <IconMail size={18} />
              <Text>{t("notifications")}</Text>
            </Group>
            <Switch
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.currentTarget.checked)}
            />
          </Group>

          <Divider />

          <Group position="apart">
            <Group>
              <IconLanguage size={18} />
              <Text>{t("language")}</Text>
            </Group>
            <Select
              data={[
                { value: "en", label: "English" },
                { value: "zh", label: "中文" },
              ]}
              value={language}
              onChange={setLanguage}
              style={{ width: 160 }}
            />
          </Group>

          <Group position="apart">
            <Group>
              <IconKey size={18} />
              <Text>{t("theme")}</Text>
            </Group>
            <Select
              data={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              value={theme}
              onChange={setTheme}
              style={{ width: 160 }}
            />
          </Group>

          <Divider />

          <Button variant="default" onClick={handleResetPassword}>
            {t("resetPassword")}
          </Button>

          <Button leftIcon={<IconDownload />} onClick={handleExportPDF}>
            {t("exportPDF")}
          </Button>

          <Button color="blue" onClick={handleSave}>
            {t("save")}
          </Button>

          {saved && (
            <Notification icon={<IconCheck />} color="teal" title={t("saveSuccess")} />
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
