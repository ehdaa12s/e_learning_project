// import { DB } from "./db.js";

// const progressContainer = document.getElementById("progressContainer");
// const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// if(!currentUser || currentUser.role !== 'student') {
//     window.location.href = "../login.html";
// }

// function renderProgress() {
//     const enrollments = DB.getEnrollments().filter(e => e.studentId === currentUser.id);
//     const courses = DB.getCourses();

//     progressContainer.innerHTML = "";

//     if(enrollments.length === 0) {
//         progressContainer.innerHTML = '<p class="no-data">You are not enrolled in any courses yet.</p>';
//         return;
//     }

//     enrollments.forEach(enroll => {
//         const course = courses.find(c => c.id === enroll.courseId);
//         if(!course) return;

//         const card = document.createElement("div");
//         card.className = "course-card";

//         card.innerHTML = `
//             <h3>${course.title}</h3>
//             <p>Instructor: ${course.instructor}</p>
//             <div class="progress-section">
//                 <div class="progress-bar">
//                     <div class="progress-fill" style="width: ${enroll.progress || 0}%"></div>
//                 </div>
//                 <span class="progress-text">${enroll.progress || 0}% Complete</span>
//             </div>
//             <a href="course-details.html?id=${course.id}" class="btn-primary">Continue Learning</a>
//         `;

//         progressContainer.appendChild(card);
//     });
// }

// renderProgress();
