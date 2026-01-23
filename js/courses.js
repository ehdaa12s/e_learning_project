import { auth } from "./firebase.js";
import { setupPaymentUI } from "./payment.js";
import { Enrollment } from "./enrollement.js";
import { CourseService } from "./services/courseService.js";

const currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  const coursesContainer = document.getElementById("coursesContainer");

  let courses = [];
  const enrollmentsByCourse = new Set();

  async function fetchData() {
    courses = await CourseService.getAll();
    const user = auth.currentUser;
    if (user) {
      const enrolledIds = await Enrollment.getCoursesByUser(user.uid);
      enrolledIds.forEach(id => enrollmentsByCourse.add(id));
    }
  }

  async function renderCourses() {
    await fetchData();
    coursesContainer.innerHTML = "";

    courses.forEach(course => {
      const card = document.createElement("div");
      card.classList.add("course-card");

      const isEnrolled = enrollmentsByCourse.has(course.id);

      // Badge "Enrolled"
      const badge = isEnrolled ? `<div class="badge">Enrolled</div>` : "";

      card.innerHTML = `
        ${badge}
        <h3>${course.title}</h3>
        <p class="duration">${course.duration}</p>
        <p class="short-desc">${course.description.slice(0, 80)}...</p>
        <button class="details-btn">View Details</button>
        <div class="actions">
          ${isEnrolled ? '<button class="enrolled-btn" disabled>Enrolled</button>' : `<button class="${course.price > 0 ? 'buy-btn' : 'enroll-btn'}">${course.price > 0 ? 'Buy Now' : 'Enroll Free'}</button>`}
        </div>
      `;

      coursesContainer.appendChild(card);

      const detailsBtn = card.querySelector(".details-btn");
      detailsBtn.addEventListener("click", () => openModal(course, isEnrolled));

      const buyBtn = card.querySelector('.buy-btn');
      const enrollBtn = card.querySelector('.enroll-btn');
      if (buyBtn) {
        buyBtn.addEventListener('click', () => openPaymentModal(course));
      }
      if (enrollBtn) {
        enrollBtn.addEventListener('click', async () => {
          const user = auth.currentUser;
          if (!user) return alert('Please login first');
          await Enrollment.enroll(user.uid, course.id);
          enrollBtn.textContent = 'Enrolled';
          enrollBtn.disabled = true;
          enrollBtn.classList.remove('enroll-btn');
          enrollBtn.classList.add('enrolled-btn');
        });
      }
    });
  }

  // ---------------- MODAL ----------------
  const modal = document.createElement("div");
  modal.className = "course-modal hidden";
  document.body.appendChild(modal);

  function openModal(course, enrolled) {
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-btn">&times;</button>
        <h2>${course.title}</h2>
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <p><strong>Category:</strong> ${course.category}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p><strong>Price:</strong> ${course.price > 0 ? "$" + course.price : "Free"}</p>
        <p><strong>Description:</strong> ${course.description}</p>
        <p><strong>Content:</strong> <a href="${course.content}" target="_blank">View Content</a></p>

        <div class="modal-actions">
          ${enrolled ? '<button class="enrolled-btn" disabled>Enrolled</button>' : `${course.price > 0 ? '<div id="paypalContainer"></div>' : '<button class="enroll-btn">Enroll Now</button>'}`}
          <button class="cancel-btn">Cancel</button>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");

    modal.querySelector(".close-btn").addEventListener("click", () => modal.classList.add("hidden"));
    modal.querySelector(".cancel-btn").addEventListener("click", () => modal.classList.add("hidden"));

    const enrollBtn = modal.querySelector('.enroll-btn');
    if (enrollBtn) {
      enrollBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) return alert('Please login first');
        await Enrollment.enroll(user.uid, course.id);
        enrollBtn.textContent = 'Enrolled';
        enrollBtn.classList.remove('enroll-btn');
        enrollBtn.classList.add('enrolled-btn');
        enrollBtn.disabled = true;
      });
    }

    const paypalContainer = modal.querySelector('#paypalContainer');
    if (paypalContainer) {
      const clientId = window.__PAYPAL_CLIENT_ID;
      if (!clientId || clientId === 'YOUR_PAYPAL_CLIENT_ID') {
        paypalContainer.innerHTML = '<div class="error">PayPal not configured.</div>';
      } else {
        setupPaymentUI({ containerId: 'paypalContainer', course, paypalClientId: clientId });
      }
    }
  }

  renderCourses();
});
