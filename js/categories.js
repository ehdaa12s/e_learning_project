import { Category } from "./category.js";

document.addEventListener("DOMContentLoaded", () => {
  const categoryNameInput = document.getElementById("categoryName");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const categoriesTableBody = document.querySelector("#categoriesTable tbody");
  const categoryError = document.getElementById("categoryError");
  const categorySuccess = document.getElementById("categorySuccess");

  async function renderCategories() {
    try {
      const categories = await Category.getAll();
      categoriesTableBody.innerHTML = "";

      categories.forEach(cat => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${cat.id}</td>
          <td>${cat.name || ""}</td>
          <td>
            <button class="editBtn" data-id="${cat.id}">Edit</button>
            <button class="deleteBtn" data-id="${cat.id}">Delete</button>
          </td>
        `;
        categoriesTableBody.appendChild(tr);
      });

      // Edit
      document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const catId = btn.dataset.id;
          const cat = await Category.findById(catId);
          const newName = prompt("Edit Category Name", (cat && cat.name) || "");
          if (!newName || newName.trim() === "") return;

          try {
            await Category.update(catId, { name: newName.trim() });
            categorySuccess.textContent = "Category updated successfully!";
            categoryError.textContent = "";
            await renderCategories();
          } catch (err) {
            categoryError.textContent = err;
            categorySuccess.textContent = "";
          }
        });
      });

      // Delete
      document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const catId = btn.dataset.id;
          try {
            await Category.delete(catId);
            categorySuccess.textContent = "Category deleted successfully!";
            categoryError.textContent = "";
            await renderCategories();
          } catch (err) {
            categoryError.textContent = err;
            categorySuccess.textContent = "";
          }
        });
      });
    } catch (err) {
      categoryError.textContent = err;
      categorySuccess.textContent = "";
    }
  }

  // Add Category
  addCategoryBtn.addEventListener("click", async () => {
    const name = categoryNameInput.value.trim();
    if (!name) {
      categoryError.textContent = "Category name cannot be empty!";
      categorySuccess.textContent = "";
      return;
    }

    try {
      await Category.create(name);
      categoryNameInput.value = "";
      categorySuccess.textContent = "Category added successfully!";
      categoryError.textContent = "";
      await renderCategories();
    } catch (err) {
      categoryError.textContent = err;
      categorySuccess.textContent = "";
    }
  });

  renderCategories();
});
