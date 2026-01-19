import { Category } from "./category.js";

document.addEventListener("DOMContentLoaded", () => {
  const categoryNameInput = document.getElementById("categoryName");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const categoriesTableBody = document.querySelector("#categoriesTable tbody");
  const categoryError = document.getElementById("categoryError");
  const categorySuccess = document.getElementById("categorySuccess");

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

    // Edit
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const catId = btn.dataset.id;
        const cat = Category.findById(catId);
        const newName = prompt("Edit Category Name", cat.name);
        if (!newName || newName.trim() === "") return;

        try {
          Category.update(catId, { name: newName.trim() });
          categorySuccess.textContent = "Category updated successfully!";
          categoryError.textContent = "";
          renderCategories();
        } catch (err) {
          categoryError.textContent = err;
          categorySuccess.textContent = "";
        }
      });
    });

    // Delete
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const catId = btn.dataset.id;
        Category.delete(catId);
        categorySuccess.textContent = "Category deleted successfully!";
        categoryError.textContent = "";
        renderCategories();
      });
    });
  }

  // Add Category
  addCategoryBtn.addEventListener("click", () => {
    const name = categoryNameInput.value.trim();
    if (!name) {
      categoryError.textContent = "Category name cannot be empty!";
      categorySuccess.textContent = "";
      return;
    }

    try {
      Category.create(name);
      categoryNameInput.value = "";
      categorySuccess.textContent = "Category added successfully!";
      categoryError.textContent = "";
      renderCategories();
    } catch (err) {
      categoryError.textContent = err;
      categorySuccess.textContent = "";
    }
  });

  renderCategories();
});
