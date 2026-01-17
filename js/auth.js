// auth.js

import { User } from "./user.js";



document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  const emailError = document.getElementById('loginEmailError');
  const passwordError = document.getElementById('loginPasswordError');
  const loginSuccess = document.getElementById('loginSuccess');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset previous messages
    emailError.textContent = '';
    passwordError.textContent = '';
    loginSuccess.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    let valid = true;


    if (!email) {
      emailError.textContent = 'Email is required';
      valid = false;
    } else if (!validateEmail(email)) {
      emailError.textContent = 'Invalid email format';
      valid = false;
    }

    if (!password) {
      passwordError.textContent = 'Password is required';
      valid = false;
    }

    if (!valid) return;

    // Attempt login
    try {
      const user = User.login(email, password); // call static login method

      loginSuccess.textContent = `Welcome, ${user.name}! Redirecting...`;

      // Redirect based on role
      setTimeout(() => {
        if (user.role === 'admin') {
          window.location.href = 'admin/dashboard.html';
        } else {
          window.location.href = 'student/courses.html'; // fixed typo
        }
      }, 1000);

    } catch (err) {
      passwordError.textContent = err; // show login errors
    }
  });

  // Helper function to validate email format
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
