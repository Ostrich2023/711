const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("./app");
const { syncUserDocument } = require("./scripts/syncUserOnLogin");

admin.initializeApp();

// ✅ 挂载 Express 应用（CORS 生效的关键！）
exports.api = functions.https.onRequest(app);

// ✅ 保留已存在的 onCall 函数
exports.syncUserDoc = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const user = await admin.auth().getUser(context.auth.uid);
  await syncUserDocument(user);
  return { message: "User document synced." };
});
