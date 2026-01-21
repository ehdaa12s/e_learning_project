import { DB } from "./db.js";

const coursesContainer = document.getElementById("coursesContainer");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const courseModal = document.getElementById("courseModal");
const modalCard = document.getElementById("modalCard");
const closeModalBtn = courseModal.querySelector(".close-btn");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser || currentUser.role !== "student") {
    window.location.href = '../login.html';
}

// Load wishlist & enrollments
let wishlist = JSON.parse(localStorage.getItem('wishlist_' + currentUser.id)) || [];
let enrolled = JSON.parse(localStorage.getItem('enrollments_' + currentUser.id)) || [];

// ---------------- Render Courses ----------------
function renderCourses() {
    const courses = DB.getCourses();
    if(!courses || courses.length === 0){
        coursesContainer.innerHTML = '<p class="no-data">No courses available.</p>';
        return;
    }

    let filtered = courses.filter(c => c.title.toLowerCase().includes(searchInput.value.toLowerCase()));
    if(filterCategory.value) {
        filtered = filtered.filter(c => c.category === filterCategory.value);
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
            <p>${course.description.slice(0,80)}...</p>
            <button class="btn-details" onclick="viewDetails('${course.id}')">View Details</button>
            <button class="btn-add-wishlist" onclick="toggleWishlist('${course.id}')" ${isInWishlist ? 'disabled' : ''}>
                ${isInWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
            </button>
            <button class="btn-enroll" onclick="enrollCourse('${course.id}')" ${isEnrolled ? 'disabled' : ''}>
                ${isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </button>
        `;
        coursesContainer.appendChild(card);
    });
}

// ---------------- Wishlist ----------------
window.toggleWishlist = function(courseId){
    if(wishlist.includes(courseId)) {
        wishlist = wishlist.filter(id => id !== courseId);
    } else {
        wishlist.push(courseId);
    }
    localStorage.setItem('wishlist_' + currentUser.id, JSON.stringify(wishlist));
    renderCourses();
}

// ---------------- Enroll ----------------
window.enrollCourse = function(courseId){
    if(!enrolled.includes(courseId)){
        enrolled.push(courseId);
        localStorage.setItem('enrollments_' + currentUser.id, JSON.stringify(enrolled));
        alert('Successfully enrolled!');
    }
    renderCourses();
}

// ---------------- View Details (Modal) ----------------
window.viewDetails = function(courseId){
    const courses = DB.getCourses();
    const course = courses.find(c => c.id === courseId);
    if(!course) return;

    modalCard.innerHTML = `
        <h2>${course.title}</h2>
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <p><strong>Category:</strong> ${course.category}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p><strong>Price:</strong> ${course.price > 0 ? '$'+course.price : 'Free'}</p>
        <p><strong>Description:</strong> ${course.description}</p>
        <p><strong>Content:</strong> <a href="${course.content}" target="_blank">View Content</a></p>
    `;
    courseModal.classList.remove("hidden");
}

closeModalBtn.addEventListener("click", () => {
    courseModal.classList.add("hidden");
});

// ---------------- Initial Render ----------------
renderCourses();

// ---------------- Event Listeners ----------------
searchInput.addEventListener('input', renderCourses);
filterCategory.addEventListener('change', renderCourses);
