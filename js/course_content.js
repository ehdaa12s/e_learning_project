import { DB } from "../js/db.js";

// get current course from localStorage
const courseId = localStorage.getItem("currentCourseId");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "student") {
  window.location.href = "../login.html";
}

// elements
const courseTitle = document.getElementById("courseTitle");
const videoFrame = document.getElementById("videoFrame");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const completeBtn = document.getElementById("completeBtn");

document.getElementById("studentName").textContent = currentUser.name;

// get course
const course = DB.getCourses().find(c => c.id === courseId);
if (!course) {
  alert("Course not found!");
  window.location.href = "./my-courses.html";
}

// progress storage
const progressKey = `progress_${currentUser.id}_${course.id}`;
let progressData =
  JSON.parse(localStorage.getItem(progressKey)) || { currentIndex: 0, completed: [] };

// load video
function loadVideo() {
  const videoUrl = course.content[progressData.currentIndex];
  if (!videoUrl) return;

  videoFrame.setAttribute("src", videoUrl);
  updateProgressUI();
}

// update progress bar
function updateProgressUI() {
  const percent = Math.round((progressData.completed.length / course.content.length) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "%";
}

// mark video completed
completeBtn.onclick = () => {
  const idx = progressData.currentIndex;
  if (!progressData.completed.includes(idx)) {
    progressData.completed.push(idx);
    saveProgress();
    updateProgressUI();
  }
};

// next video
nextBtn.onclick = () => {
  if (progressData.currentIndex < course.content.length - 1) {
    progressData.currentIndex++;
    loadVideo();
  }
};

// previous video
prevBtn.onclick = () => {
  if (progressData.currentIndex > 0) {
    progressData.currentIndex--;
    loadVideo();
  }
};

// save progress to localStorage
function saveProgress() {
  localStorage.setItem(progressKey, JSON.stringify(progressData));
}

// initial load
courseTitle.textContent = course.title;
loadVideo();

// logout
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
};