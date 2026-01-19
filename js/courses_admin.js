import { Course } from "./course.js";
import { DB } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ===== Add Form ===== */
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

  /* ===== Edit Modal ===== */
  const editModal = document.getElementById("editModal");
  const editTitle = document.getElementById("editTitle");
  const editInstructor = document.getElementById("editInstructor");
  const editCategory = document.getElementById("editCategory");
  const editPrice = document.getElementById("editPrice");
  const editDuration = document.getElementById("editDuration");
  const editDescription = document.getElementById("editDescription");
  const editContent = document.getElementById("editContent");
  const saveEditBtn = document.getElementById("saveEditBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const editError = document.getElementById("editError");

  let editingCourseId = null;

  /* ===== Categories ===== */
  const categories = DB.getCategories();

  function fillCategories(select, selectedValue = "") {
    select.innerHTML = '<option value="">-- Select Category --</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      if (cat.name === selectedValue) option.selected = true;
      select.appendChild(option);
    });
  }

  fillCategories(categorySelect);

  /* ===== Render Courses ===== */
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

    /* ===== Edit ===== */
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const course = Course.findById(btn.dataset.id);

        editingCourseId = course.id;

        editTitle.value = course.title;
        editInstructor.value = course.instructor;
        editPrice.value = course.price;
        editDuration.value = course.duration;
        editDescription.value = course.description;
        editContent.value = course.content;

        fillCategories(editCategory, course.category);

        editError.textContent = "";
        editModal.classList.remove("hidden");
      });
    });

    /* ===== Delete ===== */
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        Course.delete(btn.dataset.id);
        successMsg.textContent = "Course deleted successfully!";
        errorMsg.textContent = "";
        renderCourses();
      });
    });
  }

  /* ===== Add Course ===== */
  addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();

    const duplicate = Course.getAll().find(
      c => c.title.toLowerCase() === title.toLowerCase()
    );

    if (duplicate) {
      errorMsg.textContent = "Course title already exists!";
      successMsg.textContent = "";
      return;
    }

    try {
      Course.create({
        title,
        instructor: instructorInput.value.trim(),
        category: categorySelect.value,
        price: Number(priceInput.value),
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

  /* ===== Save Edit ===== */
  saveEditBtn.addEventListener("click", () => {
    const newTitle = editTitle.value.trim();

    const duplicate = Course.getAll().find(
      c => c.title.toLowerCase() === newTitle.toLowerCase()
        && c.id !== editingCourseId
    );

    if (duplicate) {
      editError.textContent = "Course title already exists!";
      return;
    }

    Course.update(editingCourseId, {
      title: newTitle,
      instructor: editInstructor.value.trim(),
      category: editCategory.value,
      price: Number(editPrice.value),
      duration: editDuration.value.trim(),
      description: editDescription.value.trim(),
      content: editContent.value.trim()
    });

    editModal.classList.add("hidden");
    renderCourses();
  });

  cancelEditBtn.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });

  renderCourses();
});
