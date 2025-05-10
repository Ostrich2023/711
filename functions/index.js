import functions from "firebase-functions";
import admin from "firebase-admin";
import app from "./app.js";
import { syncUserDocument } from "./scripts/syncUserOnLogin.js";

admin.initializeApp();

export const api = functions.https.onRequest(app);

export const syncUserDoc = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const user = await admin.auth().getUser(context.auth.uid);
  await syncUserDocument(user);
  return { message: "User document synced." };
});
