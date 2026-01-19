import { DB } from "./db.js";
import { Enrollment } from "./enrollement.js";

// مؤقت: الطالب الحالي (استبدل بالـ Auth system بعدين)
const currentUserId = 1;

const container = document.getElementById("coursesContainer");

// إنشاء modal ديناميكي
const modal = document.createElement("div");
modal.className = "course-modal hidden";
document.body.appendChild(modal);

function renderCourses() {
  const courses = DB.getCourses();
  container.innerHTML = "";

  courses.forEach(course => {
    const enrolled = Enrollment.isEnrolled(currentUserId, course.id);

    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = `
      <h3>${course.title}</h3>
      <p class="duration">⏱ ${course.duration}</p>
      <p class="short-desc">${course.description.slice(0, 80)}...</p>
      ${enrolled ? `<span class="badge">Enrolled</span>` : ""}
      <button class="details-btn">View Details</button>
    `;

    card.querySelector(".details-btn").onclick = () =>
      openDetails(course);

    container.appendChild(card);
  });
}

function openDetails(course) {
  const enrolled = Enrollment.isEnrolled(currentUserId, course.id);

  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn">&times;</button>

      <h2>${course.title}</h2>
      <p><strong>Instructor:</strong> ${course.instructor}</p>
      <p><strong>Category:</strong> ${course.category}</p>
      <p><strong>Duration:</strong> ${course.duration}</p>
      <p><strong>Price:</strong> ${course.price || "Free"}</p>

      <p class="full-desc">${course.description}</p>

      <div class="modal-actions">
        ${
          enrolled
            ? `<button class="enrolled-btn" disabled>Already Enrolled</button>`
            : `<button class="enroll-btn">Enroll Now</button>`
        }
        <button class="cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");

  modal.querySelector(".close-btn").onclick =
  modal.querySelector(".cancel-btn").onclick = closeModal;

  const enrollBtn = modal.querySelector(".enroll-btn");
  if (enrollBtn) {
    enrollBtn.onclick = () => {
      Enrollment.enroll(currentUserId, course.id);
      closeModal();
      renderCourses();
    };
  }
}

function closeModal() {
  modal.classList.add("hidden");
}

renderCourses();
