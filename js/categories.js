import { Category } from "./category.js";

document.addEventListener("DOMContentLoaded", () => {
  const categoryNameInput = document.getElementById("categoryName");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const categoriesTableBody = document.querySelector("#categoriesTable tbody");
  const categoryError = document.getElementById("categoryError");
  const categorySuccess = document.getElementById("categorySuccess");


  function showMessage({ success = "", error = "" }) {
    categorySuccess.textContent = success;
    categoryError.textContent = error;
  }

  function renderCategories() {
    const categories = Category.getAll();
    categoriesTableBody.innerHTML = "";

    categories.forEach(cat => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td>
          <button class="editBtn" data-id="${cat.id}">Edit</button>
          <button class="deleteBtn" data-id="${cat.id}">Delete</button>
        </td>
      `;
      categoriesTableBody.appendChild(tr);
    });
  }

  // Event Delegation: Edit & Delete
  categoriesTableBody.addEventListener("click", (e) => {
    const btn = e.target;

    if (btn.classList.contains("editBtn")) {
      const catId = btn.dataset.id;
      const cat = Category.findById(catId);
      const newName = prompt("Edit Category Name", cat.name);
      if (!newName) return;

      try {
        Category.update(catId, { name: newName });
        showMessage({ success: "Category updated successfully!" });
        renderCategories();
      } catch (err) {
        showMessage({ error: err });
      }
    }

    if (btn.classList.contains("deleteBtn")) {
      const catId = btn.dataset.id;
      const cat = Category.findById(catId);

      // Confirm befor delete
      const confirmDelete = window.confirm(`Are you sure you want to delete category "${cat.name}"?`);
      if (!confirmDelete) return;

      Category.delete(catId);
      showMessage({ success: "Category deleted successfully!" });
      renderCategories();
    }
  });

  // Add Category
  addCategoryBtn.addEventListener("click", () => {
    const name = categoryNameInput.value;
    try {
      Category.create(name);
      categoryNameInput.value = "";
      showMessage({ success: "Category added successfully!" });
      renderCategories();
    } catch (err) {
      showMessage({ error: err });
    }
  });

  renderCategories();
});

// Login check
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "../login.html";

// Show user info
const adminNameEl = document.getElementById("adminName");
adminNameEl.textContent = currentUser.name;

const avatarEl = document.querySelector(".admin-avatar");
avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
});
