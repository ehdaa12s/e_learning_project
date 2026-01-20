import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginPasswordError = document.getElementById("loginPasswordError");
  const forgotPassword = document.getElementById("forgotPassword");
  const loginSuccess = document.getElementById("loginSuccess");
  const loginDebug = document.getElementById("loginDebug");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    // Clear previous messages
    if (loginPasswordError) loginPasswordError.textContent = "";
    if (loginSuccess) loginSuccess.textContent = "";
    if (loginDebug) loginDebug.textContent = "";

    try {
 
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

     
      let userData;
      const adminEmails = Array.isArray(window.__ADMIN_EMAILS)
        ? window.__ADMIN_EMAILS.map(e => String(e).toLowerCase().trim())
        : [];
      const isAdminEmail = adminEmails.includes(email.toLowerCase());
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        userData = userSnap.data();
        if (!userData) {
          // Auto-provision a basic profile if missing
          userData = {
            id: uid,
            email,
            name: email.split("@")[0],
            role: isAdminEmail ? "admin" : "student",
            createdAt: Date.now()
          };
          await setDoc(userRef, userData);
        }
      } catch (fireErr) {
        console.warn('[Profile] Firestore error:', fireErr?.code, fireErr?.message);
        if (loginDebug) loginDebug.textContent = `Profile error: ${fireErr?.code || 'unknown'}`;
        // Graceful fallback: proceed as student when profile access fails
        userData = {
          id: uid,
          email,
          name: email.split("@")[0],
          role: isAdminEmail ? "admin" : "student"
        };
      }

      const effectiveRole = userData.role || (isAdminEmail ? "admin" : "student");
      if (effectiveRole === "admin") {
        window.location.href = "admin/dashboard.html";
      } else {
        window.location.href = "student/courses.html";
      }

    } catch (err) {
      console.error('[Login] Firebase error:', err?.code, err?.message, err);
      const msg = err?.code === "auth/invalid-credential"
        ? "Invalid email or password"
        : err?.code === "auth/wrong-password"
        ? "Invalid email or password"
        : err?.code === "auth/user-not-found"
        ? "No account found for this email"
        : err?.code === "auth/too-many-requests"
        ? "Too many attempts. Try again later."
        : err?.code === "auth/invalid-api-key"
        ? "Invalid Firebase config. Check API key."
        : err?.code === "auth/unauthorized-domain"
        ? "Unauthorized domain. Add this host in Firebase Auth settings."
        : err?.code === "auth/network-request-failed"
        ? "Network error. Check internet connection or CDN access."
        : err?.code === "auth/operation-not-allowed"
        ? "Email/Password sign-in is disabled in Firebase."
        : "Login failed. Please try again.";
      loginPasswordError.textContent = msg;
      if (loginDebug) loginDebug.textContent = `[${err?.code || 'no-code'}] ${err?.message || ''}`;
    }
  });

  if (forgotPassword) {
    forgotPassword.addEventListener('click', async (e) => {
      e.preventDefault();
      loginPasswordError.textContent = '';
      const email = loginEmail.value.trim();
      if (!email) {
        loginPasswordError.textContent = 'Enter your email above to reset password';
        return;
      }
      try {
        await sendPasswordResetEmail(auth, email);
        document.getElementById('loginSuccess').textContent = 'Password reset email sent. Check your inbox.';
      } catch (err) {
        console.error('[Reset] Firebase error:', err?.code, err?.message, err);
        const msg = err?.code === 'auth/user-not-found' ? 'No account found for this email'
          : err?.code === 'auth/invalid-email' ? 'Invalid email address'
          : err?.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.'
          : 'Failed to send reset email. Try again.';
        loginPasswordError.textContent = msg;
      }
    });
  }
});
