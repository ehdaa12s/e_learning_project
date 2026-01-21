import { DB } from "./db.js";

const historyContainer = document.getElementById("historyContainer");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser || currentUser.role !== 'student') {
    window.location.href = "../login.html";
}

function renderHistory() {
    const enrollments = DB.getEnrollments().filter(e => e.studentId === currentUser.id && e.progress === 100);
    const courses = DB.getCourses();
    const certificates = DB.getCertificates();

    historyContainer.innerHTML = "";

    if(enrollments.length === 0) {
        historyContainer.innerHTML = '<p class="no-data">You have not completed any courses yet.</p>';
        return;
    }

    enrollments.forEach(enroll => {
        const course = courses.find(c => c.id === enroll.courseId);
        if(!course) return;
        const cert = certificates.find(c => c.courseId === course.id && c.studentId === currentUser.id);

        const card = document.createElement("div");
        card.className = "course-card";

        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>Instructor: ${course.instructor}</p>
            <div class="course-status">Status: Completed ✅</div>
            ${cert ? `<a href="${cert.file}" class="certificate" target="_blank">View Certificate</a>` : ''}
        `;

        historyContainer.appendChild(card);
    });
}

renderHistory();
