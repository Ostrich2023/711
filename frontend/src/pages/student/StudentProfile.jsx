import React, { useEffect, useState } from "react";
import {
  Avatar, Box, Button, FileInput, Group, Paper,
  Select, Stack, Text, TextInput, Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase";
import {
  collection, doc, getDoc, getDocs,
  query, updateDoc, where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function StudentProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [majorMap, setMajorMap] = useState({});
  const [skills, setSkills] = useState([]);
  const [editing, setEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    major: "",
  });

  useEffect(() => {
    if (user) {
      fetchStudent();
      fetchMajors();
    }
  }, [user]);

  useEffect(() => {
    if (student?.id) {
      fetchApprovedSkills(student.id);
    }
  }, [student]);

  const fetchMajors = async () => {
    const snapshot = await getDocs(collection(db, "majors"));
    const map = {};
    snapshot.forEach(doc => {
      map[doc.id] = doc.data().name;
    });
    setMajorMap(map);
  };

  const fetchStudent = async () => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setStudent({ ...data, id: userDoc.id });
      setFormData({
        name: data.name || "",
        major: data.major || "",
      });
      setPreviewUrl(data.avatarUrl || null);
    }
  };

  const fetchApprovedSkills = async (uid) => {
    const q = query(
      collection(db, "skills"),
      where("ownerId", "==", uid),
      where("verified", "==", "approved")
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSkills(list);
  };

  const handleImageChange = (file) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!student) return;

    const updates = {
      name: formData.name,
      major: formData.major,
    };

    if (selectedImage) {
      const storageRef = ref(storage, `avatars/${student.id}`);
      await uploadBytes(storageRef, selectedImage);
      const url = await getDownloadURL(storageRef);
      updates.avatarUrl = url;
    }

    await updateDoc(doc(db, "users", student.id), updates);
    alert(t("profile.updated"));
    setEditing(false);
    fetchStudent();
  };

  return (
    <Box mt="xl">
      <Paper withBorder p="md" radius="md" shadow="xs">
        <Group align="flex-start" position="apart">
          <Stack spacing="xs">
            <Avatar size={100} src={previewUrl} alt="Avatar" radius="xl" />
            {editing && (
              <FileInput
                label={t("profile.changeAvatar")}
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
          </Stack>

          <Box sx={{ flex: 1 }}>
            <Title order={3}>{t("profile.title")}</Title>
            <Text size="sm" c="dimmed" mb="xs">
              {t("profile.id")}: {student?.customUid || "N/A"}
            </Text>

            {editing ? (
              <>
                <TextInput
                  label={t("profile.name")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
                  mb="sm"
                />
                <Select
                  label={t("profile.major")}
                  value={formData.major}
                  onChange={(value) => setFormData({ ...formData, major: value })}
                  data={Object.entries(majorMap).map(([id, name]) => ({
                    value: id,
                    label: name,
                  }))}
                />
              </>
            ) : (
              <>
                <Text fw={500}>{t("profile.name")}: {student?.name || "N/A"}</Text>
                <Text fw={500}>{t("profile.email")}: {student?.email || "N/A"}</Text>
                <Text fw={500}>{t("profile.major")}: {majorMap[student?.major] || "N/A"}</Text>
              </>
            )}
          </Box>

          <Box>
            {editing ? (
              <Group>
                <Button onClick={handleSave} color="blue">{t("profile.save")}</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>{t("profile.cancel")}</Button>
              </Group>
            ) : (
              <Button onClick={() => setEditing(true)}>{t("profile.edit")}</Button>
            )}
          </Box>
        </Group>
      </Paper>

      <Box mt="xl">
        <Title order={4}>{t("profile.skills")}</Title>
        {skills.length === 0 ? (
          <Text c="dimmed" mt="sm">{t("profile.noSkills")}</Text>
        ) : (
          <Stack mt="sm">
            {skills.map(skill => (
              <Paper key={skill.id} p="sm" shadow="xs" withBorder>
                <Group position="apart">
                  <div>
                    <Text fw={500}>{skill.title}</Text>
                    <Text size="sm" c="dimmed">{skill.courseTitle} ({skill.courseCode})</Text>
                  </div>
                  <Text>{t("profile.level")}: {skill.level}</Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}