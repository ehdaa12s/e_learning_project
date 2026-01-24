import { User } from "./user.js";
import { DB } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginPasswordError = document.getElementById("loginPasswordError");
  const loginSuccess = document.getElementById("loginSuccess");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    loginPasswordError.textContent = "";
    loginSuccess.textContent = "";

    try {
      const email = loginEmail.value.trim();
      const password = loginPassword.value.trim();

      const user = await User.login(email, password);

      DB.setCurrentUser(user);

      loginSuccess.textContent =
        `Welcome ${user.name}, redirecting...`;
      loginSuccess.style.color = "green";

      setTimeout(() => {
        window.location.href =
          user.role === "admin"
            ? "admin/dashboard.html"
            : "student/courses.html";
      }, 1000);

    } catch (err) {
      loginPasswordError.textContent = err.message;
    }
  });
});
