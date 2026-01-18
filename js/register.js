// js/register.js
import { User } from "./user.js";

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const role = document.getElementById('role').value;

    try {
      User.register(name, email, password, role);
      document.getElementById('registerSuccess').textContent = 'Registered successfully!';
      setTimeout(() => window.location.href = 'login.html', 1000);
    } catch(err) {
      document.getElementById('registerEmailError').textContent = err;
    }
  });
});