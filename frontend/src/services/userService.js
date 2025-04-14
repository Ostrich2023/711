import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// createUserProfile 
export async function registerUserProfile(uid, email, role, schoolId = "") {
  const customUidPrefix = role === "student"
    ? "S-" : role === "school"
    ? "T-" : role === "employer"
    ? "E-" : "A-";

  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    email,
    role,
    schoolId,
    customUid: `${customUidPrefix}${uid}`,
    createdAt: serverTimestamp()
  });
}

// getUserProfile
export async function getUserProfile(uid) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) throw new Error("User not found");
  return snapshot.data();
}

// updateUserProfile
export async function updateUserSchool(uid, newSchoolId) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    schoolId: newSchoolId
  });
}

// updateUserProfile(admin)
export async function updateUserRole(uid, newRole) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    role: newRole
  });
}
