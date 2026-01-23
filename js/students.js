import { db } from "./firebase.js";
import { getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
  const studentsTableBody = document.querySelector('#studentsTable tbody');
  const studentsCountEl = document.getElementById('studentsCount');
  const backBtn = document.getElementById('backDashboardBtn');

  const q = query(collection(db, 'users'), where('role', '==', 'student'));
  const snap = await getDocs(q);
  const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  
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
