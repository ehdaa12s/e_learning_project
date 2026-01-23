import { CourseService } from "./services/courseService.js";
import { CategoryService } from "./services/categoryService.js";
import { PlaylistService } from "./services/playlistService.js";

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
  let playlistCourseId = null;

  /* ===== Categories ===== */
  async function fillCategories(select, selectedValue = "") {
    select.innerHTML = '<option value="">-- Select Category --</option>';
    const categories = await CategoryService.getAll();
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name || "";
      option.textContent = cat.name || "";
      if ((cat.name || "") === selectedValue) option.selected = true;
      select.appendChild(option);
    });
  }

  fillCategories(categorySelect);

  /* ===== Render Courses ===== */
  async function renderCourses() {
    const courses = await CourseService.getAll();
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
          <button class="playlistBtn" data-id="${course.id}" data-title="${course.title}">Playlist</button>
          <button class="deleteBtn" data-id="${course.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    /* ===== Edit ===== */
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const course = await CourseService.findById(btn.dataset.id);

        editingCourseId = course.id;

        editTitle.value = course.title;
        editInstructor.value = course.instructor;
        editPrice.value = course.price;
        editDuration.value = course.duration;
        editDescription.value = course.description;
        editContent.value = course.content;

        await fillCategories(editCategory, course.category);

        editError.textContent = "";
        editModal.classList.remove("hidden");
      });
    });

    /* ===== Delete ===== */
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          await CourseService.delete(btn.dataset.id);
          successMsg.textContent = "Course deleted successfully!";
          errorMsg.textContent = "";
          await renderCourses();
        } catch (err) {
          errorMsg.textContent = err;
          successMsg.textContent = "";
        }
      });
    });

    /* ===== Playlist ===== */
    document.querySelectorAll(".playlistBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        playlistCourseId = btn.dataset.id;
        const courseTitle = btn.dataset.title || "Course";
        document.getElementById("playlistCourseTitle").textContent = `Manage Playlist: ${courseTitle}`;
        await renderModules();
        document.getElementById("playlistModal").classList.remove("hidden");
      });
    });
  }

  /* ===== Add Course ===== */
  addBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();

    const all = await CourseService.getAll();
    const duplicate = all.find(
      c => (c.title || "").toLowerCase() === title.toLowerCase()
    );

    if (duplicate) {
      errorMsg.textContent = "Course title already exists!";
      successMsg.textContent = "";
      return;
    }

    try {
      await CourseService.create({
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
      await renderCourses();

    } catch (err) {
      errorMsg.textContent = err;
      successMsg.textContent = "";
    }
  });

  /* ===== Save Edit ===== */
  saveEditBtn.addEventListener("click", async () => {
    const newTitle = editTitle.value.trim();

    const all = await CourseService.getAll();
    const duplicate = all.find(
      c => (c.title || "").toLowerCase() === newTitle.toLowerCase()
        && c.id !== editingCourseId
    );

    if (duplicate) {
      editError.textContent = "Course title already exists!";
      return;
    }

    try {
      await CourseService.update(editingCourseId, {
        title: newTitle,
        instructor: editInstructor.value.trim(),
        category: editCategory.value,
        price: Number(editPrice.value),
        duration: editDuration.value.trim(),
        description: editDescription.value.trim(),
        content: editContent.value.trim()
      });

      editModal.classList.add("hidden");
      await renderCourses();
    } catch (err) {
      editError.textContent = err;
    }
  });

  cancelEditBtn.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });

  renderCourses();

  /* ===== Playlist Modal Logic ===== */
  const playlistModal = document.getElementById("playlistModal");
  const modulesList = document.getElementById("modulesList");
  const addModuleBtn = document.getElementById("addModuleBtn");
  const closePlaylistBtn = document.getElementById("closePlaylistBtn");
  const playlistError = document.getElementById("playlistError");
  const playlistSuccess = document.getElementById("playlistSuccess");
  const moduleTitle = document.getElementById("moduleTitle");
  const moduleVideoUrl = document.getElementById("moduleVideoUrl");
  const moduleDuration = document.getElementById("moduleDuration");
  const moduleOrder = document.getElementById("moduleOrder");

  async function renderModules() {
    modulesList.innerHTML = "";
    if (!playlistCourseId) return;
    const modules = await PlaylistService.listModules(playlistCourseId);
    modules.sort((a, b) => (Number(a.order || 0) - Number(b.order || 0)));

    if (modules.length === 0) {
      modulesList.innerHTML = '<li>No modules yet</li>';
      return;
    }

    modules.forEach(m => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="module-info">
          <strong>${m.order ?? 0}. ${m.title}</strong>
          <div>${m.duration ? `Duration: ${m.duration}` : ""}</div>
          <a href="${m.videoUrl}" target="_blank">Open Video</a>
        </div>
        <div>
          <button class="deleteModuleBtn" data-id="${m.id}">Delete</button>
        </div>
      `;
      modulesList.appendChild(li);
    });

    document.querySelectorAll(".deleteModuleBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          await PlaylistService.deleteModule(playlistCourseId, btn.dataset.id);
          playlistSuccess.textContent = "Module deleted";
          playlistError.textContent = "";
          await renderModules();
        } catch (err) {
          playlistError.textContent = err?.message || String(err);
          playlistSuccess.textContent = "";
        }
      });
    });
  }

  addModuleBtn?.addEventListener("click", async () => {
    playlistError.textContent = "";
    playlistSuccess.textContent = "";
    const title = moduleTitle.value.trim();
    const url = moduleVideoUrl.value.trim();
    const dur = moduleDuration.value.trim();
    const ord = Number(moduleOrder.value || 0);
    if (!playlistCourseId) {
      playlistError.textContent = "No course selected";
      return;
    }
    if (!title || !url) {
      playlistError.textContent = "Title and Video URL are required";
      return;
    }
    try {
      await PlaylistService.addModule(playlistCourseId, {
        title,
        videoUrl: url,
        duration: dur,
        order: ord,
        createdAt: Date.now()
      });
      playlistSuccess.textContent = "Module added";
      moduleTitle.value = "";
      moduleVideoUrl.value = "";
      moduleDuration.value = "";
      moduleOrder.value = "";
      await renderModules();
    } catch (err) {
      playlistError.textContent = err?.message || String(err);
    }
  });

  closePlaylistBtn?.addEventListener("click", () => {
    playlistModal.classList.add("hidden");
    playlistCourseId = null;
    modulesList.innerHTML = "";
    playlistError.textContent = "";
    playlistSuccess.textContent = "";
  });
});
