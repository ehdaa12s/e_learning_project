import { DB } from "../js/db.js";

document.addEventListener("DOMContentLoaded", () => {
  const totalCategories = document.getElementById("totalCategories");
  const totalCourses = document.getElementById("totalCourses");
  const totalUsers = document.getElementById("totalUsers");
  const totalEnrollments = document.getElementById("totalEnrollments");

  // جلب الداتا من الـ DB
  const categories = DB.getCategories();
  const courses = DB.getCourses();
  const users = DB.getUsers();

  // حساب الطلاب فقط
  const students = users.filter(u => u.role.toLowerCase() === "student");

  // حساب كل الإنرولمنتز لكل الطلاب
  let enrollmentsCount = 0;
  students.forEach(student => {
    const enrollmentsKey = "enrollments_" + student.id;
    const studentEnrollments = JSON.parse(localStorage.getItem(enrollmentsKey)) || [];
    enrollmentsCount += studentEnrollments.length;
  });

  // عرض النتائج
  totalCategories.textContent = categories.length;
  totalCourses.textContent = courses.length;
  totalUsers.textContent = students.length;
  totalEnrollments.textContent = enrollmentsCount;

  // عرض Admin login
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "../login.html";
    return;
  }

  const adminNameEl = document.getElementById("adminName");
  adminNameEl.textContent = currentUser.name;

  const avatarEl = document.querySelector(".admin-avatar");
  avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  });
});
