// functions/scripts/syncUserOnLogin.js
const admin = require("firebase-admin");

/**
 * Create Firestore user doc if not exists
 * @param {object} user Firebase Auth user
 */
async function syncUserDocument(user) {
  const uid = user.uid;
  const email = user.email;

  const userRef = admin.firestore().doc(`users/${uid}`);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    let role = "student";
    if (email.includes("@admin")) role = "admin";
    else if (email.includes("@school")) role = "school";
    else if (email.includes("@employer")) role = "employer";

    const prefix = role === "student" ? "S" : role === "school" ? "T" : role === "employer" ? "E" : "A";
    const customUid = `${prefix}-${uid.slice(0, 6)}`;

    await userRef.set({
      email,
      role,
      customUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Synced user doc for ${email}`);
  } else {
    console.log(`ℹ️ User doc already exists for ${email}`);
  }
}

module.exports = { syncUserDocument };
