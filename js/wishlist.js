import { DB } from "./db.js";

const wishlistContainer = document.getElementById("wishlistContainer");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const courseModal = document.getElementById("courseModal");
const modalCard = document.getElementById("modalCard");
const closeModalBtn = document.querySelector(".close-btn");

if (!currentUser || currentUser.role !== "student") {
    window.location.href = '../login.html';
}

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

function renderWishlist(){
    const wishlist = JSON.parse(localStorage.getItem('wishlist_' + currentUser.id)) || [];
    const courses = DB.getCourses();

    wishlistContainer.innerHTML = "";

    if(wishlist.length === 0){
        wishlistContainer.innerHTML = '<p class="no-data">Your wishlist is empty.</p>';
        return;
    }

    const studentNameEl = document.getElementById("studentName");
    studentNameEl.textContent = currentUser.name;

    wishlist.forEach(id => {
        const course = courses.find(c => c.id === id);
        if(!course) return;

        const card = document.createElement("div");
        card.className = "course-card";

        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.duration}</p>
            <p>${course.description.slice(0,80)}...</p>
            <button class="btn-remove">Remove from Wishlist</button>
            <button class="btn-details">View Details</button>
        `;

        // Events
        card.querySelector(".btn-remove").addEventListener("click", () => toggleWishlist(course.id));
        card.querySelector(".btn-details").addEventListener("click", () => viewDetails(course.id));

        wishlistContainer.appendChild(card);
    });
}

window.toggleWishlist = function(courseId) {
    let wishlist = JSON.parse(
        localStorage.getItem('wishlist_' + currentUser.id)
    ) || [];

    // remove course from wishlist
    wishlist = wishlist.filter(id => id !== courseId);

    // store the edited wishlist
    localStorage.setItem(
        'wishlist_' + currentUser.id,
        JSON.stringify(wishlist)
    );

    // update page
    renderWishlist();
};

window.renderWishlist = renderWishlist;
renderWishlist();
