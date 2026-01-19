import { DB } from "../js/db.js";   // تأكد المسار صحيح حسب مكان students.js
import { User } from "../js/user.js";

document.addEventListener('DOMContentLoaded', () => {
  const studentsTableBody = document.querySelector('#studentsTable tbody');
  const studentsCountEl = document.getElementById('studentsCount');
  const backBtn = document.getElementById('backDashboardBtn');

  // جلب كل المستخدمين من LocalStorage
  const users = DB.getUsers();
  const students = users.filter(u => u.role === 'student');

  // عرض عدد الطلاب
  studentsCountEl.textContent = `Total Students: ${students.length}`;

  // عرض الطلاب في الجدول
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
