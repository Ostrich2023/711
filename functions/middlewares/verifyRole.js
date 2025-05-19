// Unified role-based middleware - verifyRole.js
import admin from "firebase-admin";

// Common Firebase auth + Firestore user extraction
async function verifyFirebaseToken(req) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) throw new Error("No token provided");

  const decoded = await admin.auth().verifyIdToken(idToken);
  const userDoc = await admin.firestore().doc(`users/${decoded.uid}`).get();
  if (!userDoc.exists) throw new Error("User not found in Firestore");

  return { uid: decoded.uid, ...userDoc.data() };
}

//  Student-only route
export async function verifyStudent(req, res, next) {
  try {
    const user = await verifyFirebaseToken(req);
    if (user.role !== "student") return res.status(403).send("Only students can access this resource");
    req.user = user;
    next();
  } catch (err) {
    console.error("verifyStudent error:", err.message);
    res.status(401).send("Unauthorized");
  }
}

// Teacher-only route
export async function verifyTeacher(req, res, next) {
  try {
    const user = await verifyFirebaseToken(req);
    if (user.role !== "teacher" && user.role !== "school") return res.status(403).send("Only teachers can access this resource");
    req.user = user;
    next();
  } catch (err) {
    console.error("verifyTeacher error:", err.message);
    res.status(401).send("Unauthorized");
  }
}

//  Employer-only route
export async function verifyEmployer(req, res, next) {
  try {
    const user = await verifyFirebaseToken(req);
    if (user.role !== "employer") return res.status(403).send("Only employers can access this resource");
    req.user = user;
    next();
  } catch (err) {
    console.error("verifyEmployer error:", err.message);
    res.status(401).send("Unauthorized");
  }
}

// Generic multi-role route, e.g. ["admin", "school"]
export function verifyRole(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const user = await verifyFirebaseToken(req);
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).send("Access denied. Role not allowed.");
      }
      req.user = user;
      next();
    } catch (err) {
      console.error("verifyRole error:", err.message);
      res.status(401).send("Unauthorized");
    }
  };
}

// Admin-only route (moved from admin.js)
export async function verifyAdmin(req, res, next) {
  try {
    const user = await verifyFirebaseToken(req);
    if (user.role !== "admin") return res.status(403).send("Only admins can access this resource");
    req.user = user;
    next();
  } catch (err) {
    console.error("verifyAdmin error:", err.message);
    res.status(401).send("Unauthorized");
  }
}