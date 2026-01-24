import { User } from "./user.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  const nameInput = document.getElementById("registerName");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const roleSelect = document.getElementById("role");

  const nameError = document.getElementById("registerNameError");
  const emailError = document.getElementById("registerEmailError");
  const passwordError = document.getElementById("registerPasswordError");
  const confirmError = document.getElementById("confirmPasswordError");
  const roleError = document.getElementById("registerRoleError"); 
  const successMsg = document.getElementById("registerSuccess");

  function clearErrors() {
    [nameError, emailError, passwordError, confirmError, roleError, successMsg].forEach(el => {
      if(el) el.textContent = "";
    });
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const role = roleSelect.value;

    let isValid = true;

    if (name.length < 3) {
      nameError.textContent = "Name must be at least 3 characters";
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    if (password.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (password !== confirmPassword) {
      confirmError.textContent = "Passwords do not match.";
      isValid = false;
    }

    if (!["student", "admin"].includes(role)) {
      roleError.textContent = "Please select a valid role.";
      isValid = false;
    }

    if (!isValid) return;

    try {
      await User.register(name, email, password, role);
      successMsg.textContent = "Registered successfully!";
      successMsg.style.color = "green";
      registerForm.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    } catch (err) {
      emailError.textContent = err.message;
    }
  });
});
