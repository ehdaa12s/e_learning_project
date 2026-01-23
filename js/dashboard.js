import { db } from "./firebase.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const totalCategories = document.getElementById("totalCategories");
  const totalCourses = document.getElementById("totalCourses");
  const totalUsers = document.getElementById("totalUsers");
  const totalEnrollments = document.getElementById("totalEnrollments");

  async function loadCounts() {
    const [catSnap, courseSnap, userSnap, enrSnap] = await Promise.all([
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "courses")),
      getDocs(collection(db, "users")),
      getDocs(collection(db, "enrollments"))
    ]);

    totalCategories.textContent = catSnap.size;
    totalCourses.textContent = courseSnap.size;
    totalUsers.textContent = userSnap.size;
    totalEnrollments.textContent = enrSnap.size;
  }

  loadCounts();
});
