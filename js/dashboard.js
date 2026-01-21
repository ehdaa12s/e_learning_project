import { DB } from "../js/db.js";

document.addEventListener("DOMContentLoaded", () => {
  const totalCategories = document.getElementById("totalCategories");
  const totalCourses = document.getElementById("totalCourses");
  const totalUsers = document.getElementById("totalUsers");
  const totalEnrollments = document.getElementById("totalEnrollments");

  const categories = DB.getCategories();
  const courses = DB.getCourses();
  const users = DB.getUsers();
  const enrollments = DB.getEnrollments();


  const students = users.filter(u =>
  u.role && u.role.toLowerCase() === "student"
);
  totalCategories.textContent = categories.length;
  totalCourses.textContent = courses.length;
  totalUsers.textContent = students.length;
  totalEnrollments.textContent = enrollments.length;


// take the Admin login from DB
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

});
