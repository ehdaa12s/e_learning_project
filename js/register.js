// js/register.js
import { User } from "./user.js";

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const role = document.getElementById('role').value;

    // Basic validation
    document.getElementById('registerEmailError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
    if (password !== confirmPassword) {
      document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
      return;
    }

    try {
      await User.register(name, email, password, role);
      document.getElementById('registerSuccess').textContent = 'Registered successfully!';
      setTimeout(() => window.location.href = 'login.html', 1000);
    } catch(err) {
      const code = err?.code || '';
      const msg = code === 'auth/email-already-in-use' ? 'Email already exists'
        : code === 'auth/invalid-email' ? 'Invalid email address'
        : code === 'auth/weak-password' ? 'Password should be at least 6 characters'
        : (typeof err === 'string' ? err : 'Registration failed');
      document.getElementById('registerEmailError').textContent = msg;
    }
  });
});