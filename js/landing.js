import { Course } from "./course.js";

const featuredCoursesContainer = document.getElementById("featuredCoursesContainer");
const searchInput = document.querySelector(".search-box input");
const searchBtn = document.querySelector(".search-box button");

// show courses
function renderCourses(courses) {
  featuredCoursesContainer.innerHTML = "";

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";

    const imgSrc = course.image || "assets/images/download.jpeg";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${course.title}" class="course-image">
      <h3>${course.title}</h3>
      <p class="duration">⏱ ${course.duration}</p>
      <p class="short-desc">
        ${course.description.length > 80
          ? course.description.slice(0, 80) + "..."
          : course.description}
      </p>
    `;

    
    card.addEventListener("click", () => {
      window.location.href = "login.html";
    });

    featuredCoursesContainer.appendChild(card);
  });
}

// take 8 courses
renderCourses(Course.getAll().slice(0, 8));

// Search functionality
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    renderCourses(Course.getAll().slice(0, 8));
    return;
  }

  const filtered = Course.getAll().filter(course => {
    return course.title.toLowerCase().includes(query) ||
           course.category.toLowerCase().includes(query) ||
           course.description.toLowerCase().includes(query);
  });

  renderCourses(filtered);
});

// Optional: Search on Enter key
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
