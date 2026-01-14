document.addEventListener('DOMContentLoaded', function(){

  const tbody = document.querySelector('#studentsTable tbody');
  const students = JSON.parse(localStorage.getItem('users')) || [];

  function renderStudents(){
    tbody.innerHTML = '';
    students.filter(s => s.type === 'student').forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
      `;
      tbody.appendChild(row);
    });
  }

  renderStudents();

});
document.getElementById('backDashboardBtn').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});
