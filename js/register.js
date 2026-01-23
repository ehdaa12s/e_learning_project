// js/register.js
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
  const roleError = document.getElementById("registerTypeError");
  const successMsg = document.getElementById("registerSuccess");

  const nameRegex = /^[A-Za-z_][A-Za-z0-9_]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmError.textContent = "";
    roleError.textContent = "";
    successMsg.textContent = "";
  }

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const role = roleSelect.value;

    let isValid = true;

    // Username validation
    if (!nameRegex.test(name)) {
      nameError.textContent =
        "Username must be at least 4 characters and not start with a number.";
      isValid = false;
    }

    // Email validation
    if (!emailRegex.test(email)) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      passwordError.textContent =
        "Password must be at least 6 characters and contain letters and numbers.";
      isValid = false;
    }

    // Confirm password
    if (password !== confirmPassword) {
      confirmError.textContent = "Passwords do not match.";
      isValid = false;
    }

    // Role validation
    if (!role) {
      roleError.textContent = "Please select a role.";
      isValid = false;
    }

    if (!isValid) return;

    try {
      User.register(name, email, password, role);
      successMsg.textContent = "Registered successfully!";
      registerForm.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);

    } catch (err) {
      emailError.textContent = err;
    }
  });
});
