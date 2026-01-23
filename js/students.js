import { UserService } from "./services/userService.js";

document.addEventListener('DOMContentLoaded', async () => {
  const studentsTableBody = document.querySelector('#studentsTable tbody');
  const studentsCountEl = document.getElementById('studentsCount');
  const backBtn = document.getElementById('backDashboardBtn');

  const students = await UserService.listStudents();

  
  studentsCountEl.textContent = `Total Students: ${students.length}`;


  students.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
    `;
    studentsTableBody.appendChild(tr);
  });

  // زر العودة للداشبورد
  backBtn.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
});
