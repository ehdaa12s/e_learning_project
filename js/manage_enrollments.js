import { DB } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#enrollmentsTable tbody");

  function renderEnrollmentsSummary() {
    const users = DB.getUsers();
    const courses = DB.getCourses();

    tableBody.innerHTML = "";

    if (courses.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5" style="text-align:center">No courses found</td>`;
      tableBody.appendChild(tr);
      return;
    }

    courses.forEach(course => {
      // كل الطلبة المسجلين في الكورس ده
      const enrolledKey = `enrollments_${course.id}`;
      const enrolledStudents = users.filter(user => {
        const enrollments = JSON.parse(localStorage.getItem(`enrollments_${user.id}`)) || [];
        return enrollments.includes(course.id);
      });

      // عدد الطلبة اللي خلصوا الكورس
      const completedStudents = enrolledStudents.filter(user => {
        const progress = JSON.parse(localStorage.getItem(`progress_${user.id}_${course.id}`)) || { currentIndex: 0, completed: [] };
        return progress.completed.length === (DB.getCourses().find(c => c.id === course.id).content.length);
      });

      // عدد الطلبة اللي لسه ما خلصوش
      const inProgressStudents = enrolledStudents.length - completedStudents.length;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${course.id}</td>
        <td>${course.title}</td>
        <td>${enrolledStudents.length}</td>
        <td>${completedStudents.length}</td>
        <td>${inProgressStudents}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  renderEnrollmentsSummary();
});
