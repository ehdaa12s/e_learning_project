import { DB } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {

  const currentUser = DB.getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") window.location.href = "../login.html";

  document.getElementById("adminName").textContent = currentUser.name;
  document.querySelector(".admin-avatar").textContent = currentUser.name.charAt(0).toUpperCase();
  document.getElementById("logoutBtn").addEventListener("click", () => {
    DB.removeCurrentUser();
    window.location.href = "../index.html";
  });

  // Elements
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

  const categories = DB.getCategories();

  function fillCategories(select, selectedValue = "") {
    select.innerHTML = '<option value="">-- Select Category --</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      //using in edditng select the current category
      option.textContent = cat.name;
      if (cat.name === selectedValue) option.selected = true;
      select.appendChild(option);
    });
  }

  fillCategories(categorySelect);

  // Render Courses 
  function renderCourses() {
    const courses = DB.getCourses();
    // cleare table befor adding
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
        <td>${course.content.length} videos</td>
        <td>
          <button class="editBtn" data-id="${course.id}">Edit</button>
          <button class="deleteBtn" data-id="${course.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.onclick = () => {
        const course = DB.getCourses().find(c => c.id == btn.dataset.id);
        editingCourseId = course.id;

        editTitle.value = course.title;
        editInstructor.value = course.instructor;
        editPrice.value = course.price;
        editDuration.value = course.duration;
        editDescription.value = course.description;
        editContent.value = course.content.join(", ");

        // fill select category
        fillCategories(editCategory, course.category);

        editError.textContent = "";
        // show modal
        editModal.classList.remove("hidden");
      };
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.onclick = () => {
        if (!confirm("Are you sure?")) return;

        const courses = DB.getCourses().filter(c => c.id != btn.dataset.id);
        DB.saveCourses(courses);

        successMsg.textContent = "Course deleted successfully!";
        errorMsg.textContent = "";
        renderCourses();
      };
    });
  }

  const titleRegex = /^[^\d][\w\s\-_]{2,}$/;
  const instructorRegex = /^[A-Za-z\s]{3,}$/;
  const urlRegex = /^(https?:\/\/[^\s]+)$/;

  function validateCourseData({ title, instructor, category, price, duration, description, contentArray }) {
    if (!titleRegex.test(title)) throw "Title must be at least 3 characters and not start with a number!";
    if (!instructorRegex.test(instructor)) throw "Instructor name must be at least 3 letters and only letters/spaces!";
    if (!category) throw "Please select a category!";
    if (isNaN(price) || price < 0) throw "Price must be a positive number!";
    if (!duration) throw "Duration is required!";
    if (description.length < 10) throw "Description must be at least 10 characters!";
    contentArray.forEach(link => {
      if (!urlRegex.test(link)) throw "Content links must be valid URLs!";
    });
  }

  // Add course
  addBtn.onclick = () => {
    const title = titleInput.value.trim();
    const instructor = instructorInput.value.trim();
    const category = categorySelect.value;
    const price = Number(priceInput.value);
    const duration = durationInput.value.trim();
    const description = descriptionInput.value.trim();
    const contentArray = contentInput.value.split(",").map(l => l.trim()).filter(l => l);

    try {
      validateCourseData({ title, instructor, category, price, duration, description, contentArray });

      const courses = DB.getCourses();
      if (courses.some(c => c.title.toLowerCase() === title.toLowerCase())) throw "Course title already exists!";

      // n obj
      const newCourse = {
        id: Date.now().toString(),
        title, instructor, category, price, duration, description, content: contentArray
      };
      // take old version of course and add to them new course
      DB.saveCourses([...courses, newCourse]);

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
  };

  saveEditBtn.onclick = () => {
    const newTitle = editTitle.value.trim();
    const newInstructor = editInstructor.value.trim();
    const newCategory = editCategory.value;
    const newPrice = Number(editPrice.value);
    const newDuration = editDuration.value.trim();
    const newDescription = editDescription.value.trim();
    const newContentArray = editContent.value.split(",").map(l => l.trim()).filter(l => l);

    try {
      validateCourseData({ title: newTitle, instructor: newInstructor, category: newCategory, price: newPrice, duration: newDuration, description: newDescription, contentArray: newContentArray });

      let courses = DB.getCourses();
      if (courses.some(c => c.title.toLowerCase() === newTitle.toLowerCase() && c.id != editingCourseId)) throw "Course title already exists!";

      courses = courses.map(c => c.id == editingCourseId ? { ...c, title: newTitle, instructor: newInstructor, category: newCategory, price: newPrice, duration: newDuration, description: newDescription, content: newContentArray } : c);

      DB.saveCourses(courses);
      editModal.classList.add("hidden");
      renderCourses();
      editError.textContent = "";

    } catch (err) {
      editError.textContent = err;
    }
  };

  cancelEditBtn.onclick = () => editModal.classList.add("hidden");

  renderCourses();
});
