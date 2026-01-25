import { DB } from "../js/db.js";

document.addEventListener("DOMContentLoaded", () => {
  const myCoursesContainer = document.getElementById("myCoursesContainer");
  const studentNameEl = document.getElementById("studentName");
  const modal = document.getElementById("courseModal");
  const modalCard = document.getElementById("modalCard");
  const closeBtn = document.querySelector(".close-btn");

  //  Auth 
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "student") {
    window.location.href = "../login.html";
    return;
  }
  studentNameEl.textContent = currentUser.name;

  //  Data 
  const courses = DB.getCourses();
  const enrolledCourseIds =
    JSON.parse(localStorage.getItem("enrollments_" + currentUser.id)) || [];

  if (enrolledCourseIds.length === 0) {
    myCoursesContainer.innerHTML =
      `<p class="no-data">You are not enrolled in any courses yet.</p>`;
    return;
  }

  //  Render 
  myCoursesContainer.innerHTML = enrolledCourseIds.map(courseId => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return "";

    return `
      <div class="course-card">
        <h3>${course.title}</h3>
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <p><strong>Category:</strong> ${course.category}</p>

        <button class="btn-primary"
          onclick="openCourse('${course.id}')">
          View Content
        </button>
      </div>
    `;
  }).join("");

  //  Open Course 
  window.openCourse = function(courseId) {
    localStorage.setItem("currentCourseId", courseId);
    window.location.href = "course_content.html";
  };

  //  Modal Close 
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  //  Logout 
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  });
});
