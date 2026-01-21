import { DB } from "../js/db.js";

document.addEventListener("DOMContentLoaded", () => {
  const myCoursesContainer = document.getElementById("myCoursesContainer");
  const studentNameEl = document.getElementById("studentName");
  const modal = document.getElementById("courseModal");
  const modalCard = document.getElementById("modalCard");
  const closeBtn = document.querySelector(".close-btn");

  // ================= Auth =================
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "student") {
    window.location.href = "../login.html";
    return;
  }
  studentNameEl.textContent = currentUser.name;

  // ================= Data =================
  const courses = DB.getCourses();

  // ✅ المصدر الصح
  const enrolledCourseIds =
    JSON.parse(localStorage.getItem("enrollments_" + currentUser.id)) || [];

  if (enrolledCourseIds.length === 0) {
    myCoursesContainer.innerHTML =
      `<p class="no-data">You are not enrolled in any courses yet.</p>`;
    return;
  }

  // ================= Render =================
  myCoursesContainer.innerHTML = enrolledCourseIds.map(courseId => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return "";

    return `
      <div class="course-card">
        <h3>${course.title}</h3>
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <p><strong>Category:</strong> ${course.category}</p>

        <button class="btn-primary"
          onclick="viewCourse('${course.id}')">
          View Details
        </button>
      </div>
    `;
  }).join("");

  // ================= Modal =================
  window.viewCourse = function(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    modalCard.innerHTML = `
      <h2>${course.title}</h2>
      <p><strong>Instructor:</strong> ${course.instructor}</p>
      <p><strong>Duration:</strong> ${course.duration} hours</p>
      <p><strong>Description:</strong> ${course.description}</p>
      <a href="${course.content}" target="_blank" class="btn-primary">
        Go to Content
      </a>
    `;

    modal.classList.remove("hidden");
  };

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // ================= Logout =================
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  });
});
