import { DB } from "./db.js";

const wishlistContainer = document.getElementById("wishlistContainer");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "student") {
    window.location.href = '../login.html';
}
  

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
            <button class="btn-remove" onclick="toggleWishlist('${course.id}')">Remove from Wishlist</button>
            <button class="btn-details" onclick="viewDetails('${course.id}')">View Details</button>
        `;

        wishlistContainer.appendChild(card);
    });
}

window.toggleWishlist = function(courseId) {
    let wishlist = JSON.parse(
        localStorage.getItem('wishlist_' + currentUser.id)
    ) || [];

    // remove course from whitlist
    wishlist = wishlist.filter(id => id !== courseId);

    // store the editing 
    localStorage.setItem(
        'wishlist_' + currentUser.id,
        JSON.stringify(wishlist)
    );

    // update page
    renderWishlist();
};

window.renderWishlist = renderWishlist;
renderWishlist();
