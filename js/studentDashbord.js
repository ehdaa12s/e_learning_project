import { DB } from "./db.js";
import { Certificate } from "./certificate.js";

document.addEventListener("DOMContentLoaded", () => {
  const studentNameEls = document.querySelectorAll("#studentName, #studentNameDisplay");
  const myCoursesContainer = document.getElementById("myCoursesContainer");
  const certificatesContainer = document.getElementById("certificatesContainer");

  const enrolledCoursesEl = document.getElementById("enrolledCourses");
  const completedCoursesEl = document.getElementById("completedCourses");
  const inProgressCoursesEl = document.getElementById("inProgressCourses");

  const modal = document.getElementById("courseModal");
  const modalCard = document.getElementById("modalCard");
  const closeBtn = document.querySelector(".close-btn");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "student") {
    window.location.href = "../login.html";
    return;
  }
  studentNameEls.forEach(el => el.textContent = currentUser.name);

  const courses = DB.getCourses();
  const enrollments = JSON.parse(localStorage.getItem("enrollments_" + currentUser.id)) || [];
  const myCourses = enrollments.map(courseId => courses.find(c => c.id === courseId)).filter(c => c);

  // Generate certificates automatically for completed courses
  let certificates = DB.getCertificates();

  myCourses.forEach(course => {
    const progressData = JSON.parse(localStorage.getItem(`progress_${currentUser.id}_${course.id}`)) || { completed: [] };
    const isCompleted = progressData.completed.length === course.content.length;

    // Check if certificate already exists
    const hasCertificate = certificates.some(cert => cert.courseId === course.id && cert.studentId === currentUser.id);

    if (isCompleted && !hasCertificate) {
      // Generate a new certificate
      const newCert = new Certificate(
        Date.now().toString(),
        currentUser.id,
        course.id,
        new Date().toLocaleDateString()
      );
      certificates.push(newCert);
      DB.saveCertificates(certificates);
    }
  });

  // Stats
  const totalEnrolled = myCourses.length;
  const totalCompleted = myCourses.filter(course => {
    const progressData = JSON.parse(localStorage.getItem(`progress_${currentUser.id}_${course.id}`)) || { completed: [] };
    return progressData.completed.length === course.content.length;
  }).length;
  const totalInProgress = totalEnrolled - totalCompleted;

  enrolledCoursesEl.textContent = totalEnrolled;
  completedCoursesEl.textContent = totalCompleted;
  inProgressCoursesEl.textContent = totalInProgress;

  // Render Courses
  if (myCourses.length === 0) {
    myCoursesContainer.innerHTML = `<p class="no-data">You have not enrolled in any courses yet.</p>`;
  } else {
    myCoursesContainer.innerHTML = myCourses.map(course => {
      const progressData = JSON.parse(localStorage.getItem(`progress_${currentUser.id}_${course.id}`)) || { completed: [] };
      const percent = Math.round((progressData.completed.length / course.content.length) * 100);
      return `
        <div class="course-card">
          <h3>${course.title}</h3>
          <p><strong>Instructor:</strong> ${course.instructor}</p>
          <p><strong>Progress:</strong> ${percent}%</p>
          <button class="btn-primary" onclick="viewCourse('${course.id}')">View Details</button>
        </div>
      `;
    }).join(""); // using join because the output of map is a array then convert it text
  }

  // Render Certificates
  certificatesContainer.innerHTML = certificates
    .filter(cert => cert.studentId === currentUser.id)
    .map(cert => {
      const course = courses.find(c => c.id === cert.courseId);
      if (!course) return "";
      return `
        <div class="certificate-card">
          <h3>${course.title}</h3>
          <p>Issued on: ${cert.issueDate}</p>
          <button onclick="downloadCertificate('${cert.id}')">Download Certificate</button>
        </div>
      `;
    }).join("") || `<p class="no-data">You have no certificates yet.</p>`;

  // Modal for course
  window.viewCourse = function(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const progressData = JSON.parse(localStorage.getItem(`progress_${currentUser.id}_${course.id}`)) || { completed: [] };
    const percent = Math.round((progressData.completed.length / course.content.length) * 100);

    modalCard.innerHTML = `
      <h2>${course.title}</h2>
      <p><strong>Instructor:</strong> ${course.instructor}</p>
      <p><strong>Category:</strong> ${course.category}</p>
      <p><strong>Duration:</strong> ${course.duration}</p>
      <p><strong>Progress:</strong> ${percent}%</p>
      <p>${course.description}</p>
      <a href="../student/course_content.html" onclick="localStorage.setItem('currentCourseId', '${course.id}')" class="btn-primary">Go to Content</a>
    `;
    modal.classList.remove("hidden");
  };

  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  });

  // Download certificate
  window.downloadCertificate = function(certId) {
    const cert = certificates.find(c => c.id === certId);
    if (!cert) return;
    const course = courses.find(c => c.id === cert.courseId);
    new Certificate(cert.id, cert.studentId, cert.courseId, cert.issueDate)
      .downloadCertificate(currentUser.name, course.title);
  };
});
