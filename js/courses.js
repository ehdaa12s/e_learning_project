import { Course } from "./course.js";
import { DB } from "./db.js";

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

document.addEventListener("DOMContentLoaded", () => {
  const coursesContainer = document.getElementById("coursesContainer");

  const courses = Course.getAll();

  function renderCourses() {
    coursesContainer.innerHTML = "";

    courses.forEach(course => {
      const card = document.createElement("div");
      card.classList.add("course-card");

      const isEnrolled = currentUser 
        ? DB.getEnrollments().some(e => e.courseId === course.id && e.userId === currentUser.id)
        : false;

      // Badge "Enrolled"
      const badge = isEnrolled ? `<div class="badge">Enrolled</div>` : "";

      card.innerHTML = `
        ${badge}
        <h3>${course.title}</h3>
        <p class="duration">${course.duration}</p>
        <p class="short-desc">${course.description.slice(0, 80)}...</p>
        <button class="details-btn">View Details</button>
      `;

      coursesContainer.appendChild(card);

      const detailsBtn = card.querySelector(".details-btn");
      detailsBtn.addEventListener("click", () => openModal(course, isEnrolled));
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
          <button class="${enrolled ? "enrolled-btn" : "enroll-btn"}">
            ${enrolled ? "Enrolled" : "Enroll Now"}
          </button>
          <button class="cancel-btn">Cancel</button>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");

    modal.querySelector(".close-btn").addEventListener("click", () => modal.classList.add("hidden"));
    modal.querySelector(".cancel-btn").addEventListener("click", () => modal.classList.add("hidden"));

    const enrollBtn = modal.querySelector(".enroll-btn");
    if (enrollBtn) {
      enrollBtn.addEventListener("click", () => {
        if(!currentUser) return alert("Please login first");

        const alreadyEnrolled = DB.getEnrollments().some(e => e.courseId === course.id && e.userId === currentUser.id);
        if (alreadyEnrolled) return;

        const newEnroll = {
          id: "enr" + Date.now(),
          userId: currentUser.id,
          courseId: course.id,
          date: new Date().toISOString()
        };

        const allEnrollments = DB.getEnrollments();
        allEnrollments.push(newEnroll);
        DB.saveEnrollments(allEnrollments);

        enrollBtn.textContent = "Enrolled";
        enrollBtn.classList.remove("enroll-btn");
        enrollBtn.classList.add("enrolled-btn");
        enrollBtn.disabled = true;

        const card = [...coursesContainer.children].find(c => c.querySelector("h3").textContent === course.title);
        if (card && !card.querySelector(".badge")) {
          const b = document.createElement("div");
          b.className = "badge";
          b.textContent = "Enrolled";
          card.appendChild(b);
        }
      });
    }
  }

  renderCourses();
});
