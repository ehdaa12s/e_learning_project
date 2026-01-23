import { db } from "../firebase.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const StatsService = {
  async counts() {
    const [catSnap, courseSnap, userSnap, enrSnap] = await Promise.all([
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "courses")),
      getDocs(collection(db, "users")),
      getDocs(collection(db, "enrollments"))
    ]);
    return {
      categories: catSnap.size,
      courses: courseSnap.size,
      users: userSnap.size,
      enrollments: enrSnap.size
    };
  }
};