import { Course } from "./course.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("coursesContainer");
  if (!container) return;

  const courses = Course.getAll();

  if (courses.length === 0) {
    container.innerHTML = "<p>No courses available.</p>";
    return;
  }

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = `
      <h3>${course.title}</h3>
      <p><strong>Instructor:</strong> ${course.instructor}</p>
      <p><strong>Category:</strong> ${course.category}</p>
      <p><strong>Duration:</strong> ${course.duration}</p>
      <p><strong>Price:</strong> ${course.price > 0 ? "$" + course.price : "Free"}</p>
      <a href="courses_details.html?id=${course.id}">View Details</a>
    `;

    container.appendChild(card);
  });
});
