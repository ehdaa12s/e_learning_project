import { StatsService } from "./services/statsService.js";

document.addEventListener("DOMContentLoaded", () => {
  const totalCategories = document.getElementById("totalCategories");
  const totalCourses = document.getElementById("totalCourses");
  const totalUsers = document.getElementById("totalUsers");
  const totalEnrollments = document.getElementById("totalEnrollments");

  async function loadCounts() {
    const counts = await StatsService.counts();
    totalCategories.textContent = counts.categories;
    totalCourses.textContent = counts.courses;
    totalUsers.textContent = counts.users;
    totalEnrollments.textContent = counts.enrollments;
  }

  loadCounts();
});
