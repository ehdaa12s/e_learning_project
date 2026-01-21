import { DB } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
  const studentNameEls = document.querySelectorAll("#studentName, #studentNameDisplay");
  const myCoursesContainer = document.getElementById("myCoursesContainer");

  const enrolledCoursesEl = document.getElementById("enrolledCourses");
  const completedCoursesEl = document.getElementById("completedCourses");
  const inProgressCoursesEl = document.getElementById("inProgressCourses");

  const modal = document.getElementById("courseModal");
  const modalCard = document.getElementById("modalCard");
  const closeBtn = document.querySelector(".close-btn");

  // ================= Auth =================
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "student") {
    window.location.href = "../login.html";
    return;
  }

  studentNameEls.forEach(el => el.textContent = currentUser.name);

  // ================= Data =================
  const courses = DB.getCourses();
  const enrollments = JSON.parse(localStorage.getItem("enrollments_" + currentUser.id)) || [];

  const myCourses = enrollments.map(courseId => {
    return courses.find(c => c.id === courseId);
  }).filter(c => c); // remove null if course not found

  // ================= Stats =================
  const totalEnrolled = myCourses.length;
  const totalCompleted = myCourses.filter((c, i) => {
    const progress = JSON.parse(localStorage.getItem("progress_" + currentUser.id + "_" + c.id)) || 0;
    return progress >= 100;
  }).length;
  const totalInProgress = totalEnrolled - totalCompleted;

  enrolledCoursesEl.textContent = totalEnrolled;
  completedCoursesEl.textContent = totalCompleted;
  inProgressCoursesEl.textContent = totalInProgress;

  // ================= Render Courses =================
  if (myCourses.length === 0) {
    myCoursesContainer.innerHTML = `<p class="no-data">You have not enrolled in any courses yet.</p>`;
  } else {
    myCoursesContainer.innerHTML = myCourses.map(course => {
      const progress = JSON.parse(localStorage.getItem("progress_" + currentUser.id + "_" + course.id)) || 0;

      return `
        <div class="course-card">
          <h3>${course.title}</h3>
          <p><strong>Instructor:</strong> ${course.instructor}</p>
          <p><strong>Progress:</strong> ${progress}%</p>
          <button class="btn-primary" onclick="viewCourse('${course.id}')">View Details</button>
        </div>
      `;
    }).join("");
  }

  // ================= Modal =================
  window.viewCourse = function(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const progress = JSON.parse(localStorage.getItem("progress_" + currentUser.id + "_" + course.id)) || 0;

    modalCard.innerHTML = `
      <h2>${course.title}</h2>
      <p><strong>Instructor:</strong> ${course.instructor}</p>
      <p><strong>Category:</strong> ${course.category}</p>
      <p><strong>Duration:</strong> ${course.duration}</p>
      <p><strong>Progress:</strong> ${progress}%</p>
      <p>${course.description}</p>
      <a href="${course.content}" target="_blank" class="btn-primary">Go to Content</a>
    `;

    modal.classList.remove("hidden");
  };

  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  // ================= Logout =================
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  });
});
