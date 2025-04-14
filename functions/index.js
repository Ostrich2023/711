const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { syncUserDocument } = require("./scripts/syncUserOnLogin");

exports.syncUserDoc = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const user = await admin.auth().getUser(context.auth.uid);
  await syncUserDocument(user);
  return { message: "User document synced." };
});
