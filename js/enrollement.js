import { DB } from "./db.js";

const enrollmentsContainer = document.getElementById("enrollmentsContainer");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "student") {
    window.location.href = '../login.html';
}

function renderEnrollments(){
    const enrolled = JSON.parse(localStorage.getItem('enrollments_' + currentUser.id)) || [];
    const courses = DB.getCourses();

    enrollmentsContainer.innerHTML = "";

    if(enrolled.length === 0){
        enrollmentsContainer.innerHTML = '<p class="no-data">You are not enrolled in any courses yet.</p>';
        return;
    }

    enrolled.forEach(id => {
        const course = courses.find(c => c.id === id);
        if(!course) return;

        const card = document.createElement("div");
        card.className = "course-card";

        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.duration}</p>
            <p>${course.description.slice(0,80)}...</p>
            <button class="btn-details" onclick="viewDetails('${course.id}')">View Details</button>
        `;

        enrollmentsContainer.appendChild(card);
    });
}

window.renderEnrollments = renderEnrollments;
renderEnrollments();
