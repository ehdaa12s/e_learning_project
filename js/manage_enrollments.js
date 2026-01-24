import { DB } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#enrollmentsTable tbody");

  function renderEnrollments() {
    const enrollments = DB.getEnrollments();
    const users = DB.getUsers();
    const courses = DB.getCourses();

    tableBody.innerHTML = "";

    if(enrollments.length === 0){
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5" style="text-align:center">No enrollments found</td>`;
      tableBody.appendChild(tr);
      return;
    }

    enrollments.forEach(enroll => {
      const student = users.find(u => u.id === enroll.userId);
      const course = courses.find(c => c.id === enroll.courseId);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${enroll.id}</td>
        <td>${student ? student.name : "Deleted User"}</td>
        <td>${course ? course.title : "Deleted Course"}</td>
        <td>${new Date(enroll.date).toLocaleString()}</td>
        <td>
          <button class="deleteBtn" data-id="${enroll.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Handle delete buttons
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const enrollId = btn.dataset.id;
        const updatedEnrollments = DB.getEnrollments().filter(e => e.id != enrollId);
        DB.saveEnrollments(updatedEnrollments);
        renderEnrollments();
      });
    });
  }

  renderEnrollments();
});
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "../login.html";
}

// show user name
const adminNameEl = document.getElementById("adminName");
adminNameEl.textContent = currentUser.name;

const avatarEl = document.querySelector(".admin-avatar");
avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
});

console.log("Enrollments:", DB.getEnrollments());
console.log("Users:", DB.getUsers());
console.log("Courses:", DB.getCourses());
