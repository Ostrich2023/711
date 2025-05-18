import admin from "firebase-admin";

export function verifyToken(rolesAllowed = []) {
  return async (req, res, next) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(401).send("Unauthorized");

    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      const userDoc = await admin.firestore().doc(`users/${decoded.uid}`).get();
      if (!userDoc.exists) return res.status(403).send("User not found");

      const userData = userDoc.data();
      if (rolesAllowed.length > 0 && !rolesAllowed.includes(userData.role)) {
        return res.status(403).send("Access denied.");
      }

      req.user = {
        uid: decoded.uid,
        role: userData.role,
        schoolId: userData.schoolId,
      };
      next();
    } catch (err) {
      console.error("Token error:", err);
      return res.status(403).send("Invalid token");
    }
  };
}
