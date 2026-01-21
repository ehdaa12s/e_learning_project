import { DB } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {

  const coursesContainer = document.getElementById("coursesContainer");
  const searchInput = document.getElementById("searchInput");
  const filterCategory = document.getElementById("filterCategory");
  const courseModal = document.getElementById("courseModal");
  const modalCard = document.getElementById("modalCard");
  const closeModalBtn = document.querySelector(".close-btn");

  
  // safety check
  if (!coursesContainer) {
    console.error("coursesContainer not found");
    return;
  }

  // ================= Auth =================
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "student") {
    window.location.href = "../login.html";
    return;
  }

  // ================= State =================
  let wishlist = JSON.parse(
    localStorage.getItem("wishlist_" + currentUser.id)
  ) || [];

  let enrolled = JSON.parse(
    localStorage.getItem("enrollments_" + currentUser.id)
  ) || [];

  // ================= Render =================
  function renderCourses() {
    const courses = DB.getCourses();

    if (!courses.length) {
      coursesContainer.innerHTML =
        `<p class="no-data">No courses available.</p>`;
      return;
    }

    let filtered = courses;

    if (searchInput && searchInput.value) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchInput.value.toLowerCase())
      );
    }

    if (filterCategory && filterCategory.value) {
      filtered = filtered.filter(c =>
        c.category === filterCategory.value
      );
    }

    coursesContainer.innerHTML = "";

    filtered.forEach(course => {
      const isInWishlist = wishlist.includes(course.id);
      const isEnrolled = enrolled.includes(course.id);

      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        ${isEnrolled ? '<div class="badge">Enrolled</div>' : ''}
        <h3>${course.title}</h3>
        <p>Instructor: ${course.instructor}</p>
        <p>Duration: ${course.duration}</p>
        <p>${course.description.slice(0, 80)}...</p>

        <button class="btn-details">View Details</button>
        <button class="btn-add-wishlist" ${isInWishlist ? "disabled" : ""}>
          ${isInWishlist ? "Added to Wishlist" : "Add to Wishlist"}
        </button>
        <button class="btn-enroll" ${isEnrolled ? "disabled" : ""}>
          ${isEnrolled ? "Enrolled" : "Enroll Now"}
        </button>
      `;

      // events
      card.querySelector(".btn-details").onclick = () =>
        viewDetails(course.id);

      card.querySelector(".btn-add-wishlist").onclick = () =>
        toggleWishlist(course.id);

      card.querySelector(".btn-enroll").onclick = () =>
        enrollCourse(course.id);

      coursesContainer.appendChild(card);
    });
  }

  // ================= Wishlist =================
  function toggleWishlist(courseId) {
    if (wishlist.includes(courseId)) return;

    wishlist.push(courseId);
    localStorage.setItem(
      "wishlist_" + currentUser.id,
      JSON.stringify(wishlist)
    );

    renderCourses();
  }

  // ================= Enroll =================
  function enrollCourse(courseId) {
    if (enrolled.includes(courseId)) return;

    enrolled.push(courseId);
    localStorage.setItem(
      "enrollments_" + currentUser.id,
      JSON.stringify(enrolled)
    );

    alert("Successfully enrolled 🎉");
    renderCourses();
  }
  //current user opened
  const studentNameEl = document.getElementById("studentName");
  studentNameEl.textContent = currentUser.name;
  // ================= Modal =================
  function viewDetails(courseId) {
    const course = DB.getCourses().find(c => c.id === courseId);
    if (!course) return;

    modalCard.innerHTML = `
      <h2>${course.title}</h2>
      <p><strong>Instructor:</strong> ${course.instructor}</p>
      <p><strong>Category:</strong> ${course.category}</p>
      <p><strong>Duration:</strong> ${course.duration}</p>
      <p><strong>Price:</strong> ${course.price > 0 ? "$" + course.price : "Free"}</p>
      <p>${course.description}</p>
      <a href="${course.content}" target="_blank">View Content</a>
    `;

    courseModal.classList.remove("hidden");
  }

  closeModalBtn.addEventListener("click", () => {
    courseModal.classList.add("hidden");
  });

  // ================= Init =================
  renderCourses();
  // ================= Logout =================


  if (searchInput) {
    searchInput.addEventListener("input", renderCourses);
  }

  if (filterCategory) {
    filterCategory.addEventListener("change", renderCourses);
  }

    document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  });
});


