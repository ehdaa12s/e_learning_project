import { DB } from "../js/db.js";   
import { User } from "../js/user.js";

document.addEventListener('DOMContentLoaded', () => {
  const studentsTableBody = document.querySelector('#studentsTable tbody');
  const studentsCountEl = document.getElementById('studentsCount');
  const backBtn = document.getElementById('backDashboardBtn');

  function renderStudents() {
    studentsTableBody.innerHTML = "";

    const users = DB.getUsers();
    const students = users.filter(u => u.role === 'student');

    studentsCountEl.textContent = `Total Students: ${students.length}`;

    students.forEach(student => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>
          <button class="deleteBtn" data-id="${student.id}">Delete</button>
          <button class="resetBtn" data-id="${student.id}">Reset Password</button>
        </td>
      `;
      studentsTableBody.appendChild(tr);
    });
  }

  // Event Delegation in all table
  studentsTableBody.addEventListener("click", (e) => {
    const btn = e.target;
    const users = DB.getUsers();

    // Delete Student
    if (btn.classList.contains("deleteBtn")) {
      const userId = btn.dataset.id;
      const user = users.find(u => u.id === userId);

      const confirmDelete = confirm(
        `Are you sure you want to delete "${user.name}"?`
      );
      if (!confirmDelete) return;

      const updatedUsers = users.filter(u => u.id !== userId);
      DB.saveUsers(updatedUsers);
      renderStudents();
    }

    // reset Password
    if (btn.classList.contains("resetBtn")) {
      const userId = btn.dataset.id;
      const userIndex = users.findIndex(u => u.id === userId);

      const confirmReset = confirm(
        `Reset password for "${users[userIndex].name}"?`
      );
      if (!confirmReset) return;

      users[userIndex].password = "123456"; 
      DB.saveUsers(users);
      alert("Password reset to: 123456");
    }
  });

  backBtn.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });

  renderStudents();
});
