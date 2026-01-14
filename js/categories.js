document.addEventListener('DOMContentLoaded', () => {
  const categoryNameInput = document.getElementById('categoryName');
  const addCategoryBtn = document.getElementById('addCategoryBtn');
  const categoriesTableBody = document.querySelector('#categoriesTable tbody');
  const categoryError = document.getElementById('categoryError');
  const categorySuccess = document.getElementById('categorySuccess');

  let categories = JSON.parse(localStorage.getItem('categories')) || [];

  function renderCategories() {
    categoriesTableBody.innerHTML = '';
    categories.forEach(cat => {
      const tr = document.createElement('tr');
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

    // Edit buttons
    document.querySelectorAll('.editBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.id;
        const cat = categories.find(c => c.id == catId);
        const newName = prompt('Edit Category Name', cat.name);
        if (newName && newName.trim() !== '') {

          // منع تكرار الاسم عند التعديل
          if (categories.some(c => c.name.toLowerCase() === newName.trim().toLowerCase() && c.id != catId)) {
            categoryError.textContent = 'Category name already exists!';
            categorySuccess.textContent = '';
            return;
          }

          cat.name = newName.trim();
          localStorage.setItem('categories', JSON.stringify(categories));
          categorySuccess.textContent = 'Category updated successfully!';
          categoryError.textContent = '';
          renderCategories();
        }
      });
    });

    // Delete buttons
    document.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.id;
        categories = categories.filter(c => c.id != catId);
        localStorage.setItem('categories', JSON.stringify(categories));
        categorySuccess.textContent = 'Category deleted successfully!';
        categoryError.textContent = '';
        renderCategories();
      });
    });
  }

  addCategoryBtn.addEventListener('click', () => {
    const name = categoryNameInput.value.trim();

    if (!name) {
      categoryError.textContent = 'Category name cannot be empty!';
      categorySuccess.textContent = '';
      return;
    }

    // منع تكرار الاسم عند الإضافة
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      categoryError.textContent = 'Category name already exists!';
      categorySuccess.textContent = '';
      return;
    }

    const newCategory = {
      id: 'c' + Date.now(),
      name
    };

    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    categoryNameInput.value = '';
    categorySuccess.textContent = 'Category added successfully!';
    categoryError.textContent = '';
    renderCategories();
  });

  renderCategories();
});
