import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const Enrollment = {
  async enroll(userId, courseId) {
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", userId),
      where("courseId", "==", courseId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) return; 

    await addDoc(collection(db, "enrollments"), {
      userId,
      courseId,
      status: "approved",
      createdAt: Date.now()
    });
  },

  async isEnrolled(userId, courseId) {
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", userId),
      where("courseId", "==", courseId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  }
};
