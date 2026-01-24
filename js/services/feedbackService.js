import { db } from "../firebase.js";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const FeedbackService = {
  async submit({ userId, courseId, rating, comment }) {
    const r = Number(rating);
    if (!userId || !courseId || !r || r < 1 || r > 5) {
      throw new Error("Invalid feedback payload");
    }
    return addDoc(collection(db, "feedback"), {
      userId,
      courseId,
      rating: r,
      comment: (comment || "").trim(),
      createdAt: Date.now()
    });
  },

  async listByCourse(courseId) {
    const q = query(collection(db, "feedback"), where("courseId", "==", courseId));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  },

  async listByUser(userId) {
    const q = query(collection(db, "feedback"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  },

  async averageRating(courseId) {
    const list = await this.listByCourse(courseId);
    if (!list.length) return 0;
    const sum = list.reduce((acc, f) => acc + Number(f.rating || 0), 0);
    return Math.round((sum / list.length) * 10) / 10; // one decimal
  }
};