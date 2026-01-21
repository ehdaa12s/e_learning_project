import { DB } from "../js/db.js";   
import { User } from "../js/user.js";

document.addEventListener('DOMContentLoaded', () => {
  const studentsTableBody = document.querySelector('#studentsTable tbody');
  const studentsCountEl = document.getElementById('studentsCount');
  const backBtn = document.getElementById('backDashboardBtn');

  // take all user from localstorage
  const users = DB.getUsers();
  const students = users.filter(u => u.role === 'student');

  // show the student only
  studentsCountEl.textContent = `Total Students: ${students.length}`;

  // show the student in table
  students.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
    `;
    studentsTableBody.appendChild(tr);
  });

 
  backBtn.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
});
