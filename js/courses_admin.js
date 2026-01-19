import { Course } from "./course.js";
import { DB } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("courseTitle");
  const instructorInput = document.getElementById("courseInstructor");
  const categorySelect = document.getElementById("courseCategory");
  const priceInput = document.getElementById("coursePrice");
  const durationInput = document.getElementById("courseDuration");
  const descriptionInput = document.getElementById("courseDescription");
  const contentInput = document.getElementById("courseContent");
  const addBtn = document.getElementById("addCourseBtn");
  const tableBody = document.querySelector("#coursesTable tbody");
  const errorMsg = document.getElementById("courseError");
  const successMsg = document.getElementById("courseSuccess");

  const categories = DB.getCategories();

  // Fill category select
  categorySelect.innerHTML = '<option value="">-- Select Category --</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });

  function renderCourses() {
    const courses = Course.getAll();
    tableBody.innerHTML = "";

    courses.forEach(course => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${course.id}</td>
        <td>${course.title}</td>
        <td>${course.instructor}</td>
        <td>${course.category}</td>
        <td>${course.price}</td>
        <td>${course.duration}</td>
        <td>${course.description}</td>
        <td>${course.content}</td>
        <td>
          <button class="editBtn" data-id="${course.id}">Edit</button>
          <button class="deleteBtn" data-id="${course.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Edit
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const course = Course.findById(btn.dataset.id);
        const newTitle = prompt("Course Title", course.title);
        const newInstructor = prompt("Instructor Name", course.instructor);
        const newCategory = prompt("Category", course.category);
        const newPrice = prompt("Price", course.price);
        const newDuration = prompt("Duration", course.duration);
        const newDescription = prompt("Description", course.description);
        const newContent = prompt("Content URL", course.content);

        if (!newTitle || !newInstructor || !newCategory || !newPrice || !newDuration) return;

        try {
          Course.update(course.id, {
            title: newTitle,
            instructor: newInstructor,
            category: newCategory,
            price: Number(newPrice),
            duration: newDuration,
            description: newDescription,
            content: newContent
          });
          successMsg.textContent = "Course updated successfully!";
          errorMsg.textContent = "";
          renderCourses();
        } catch (err) {
          errorMsg.textContent = err;
          successMsg.textContent = "";
        }
      });
    });

    // Delete
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        Course.delete(btn.dataset.id);
        successMsg.textContent = "Course deleted successfully!";
        errorMsg.textContent = "";
        renderCourses();
      });
    });
  }

  addBtn.addEventListener("click", () => {
    try {
      Course.create({
        title: titleInput.value.trim(),
        instructor: instructorInput.value.trim(),
        category: categorySelect.value,
        price: Number(priceInput.value.trim()),
        duration: durationInput.value.trim(),
        description: descriptionInput.value.trim(),
        content: contentInput.value.trim()
      });

      titleInput.value = "";
      instructorInput.value = "";
      categorySelect.value = "";
      priceInput.value = "";
      durationInput.value = "";
      descriptionInput.value = "";
      contentInput.value = "";

      successMsg.textContent = "Course added successfully!";
      errorMsg.textContent = "";
      renderCourses();
    } catch (err) {
      errorMsg.textContent = err;
      successMsg.textContent = "";
    }
  });

  renderCourses();
});
