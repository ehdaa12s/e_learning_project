document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('courseTitle');
  const instructorInput = document.getElementById('courseInstructor');
  const categorySelect = document.getElementById('courseCategory');
  const priceInput = document.getElementById('coursePrice');
  const durationInput = document.getElementById('courseDuration');
  const descriptionInput = document.getElementById('courseDescription');
  const contentInput = document.getElementById('courseContent');
  const addBtn = document.getElementById('addCourseBtn');
  const tableBody = document.querySelector('#coursesTable tbody');
  const errorMsg = document.getElementById('courseError');
  const successMsg = document.getElementById('courseSuccess');

  let courses = JSON.parse(localStorage.getItem('courses')) || [];
  let categories = JSON.parse(localStorage.getItem('categories')) || [];

  // Fill category select
  function populateCategories() {
    categorySelect.innerHTML = '<option value="">-- Select Category --</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.name;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  }
  populateCategories();

  function renderCourses() {
    tableBody.innerHTML = '';
    courses.forEach(course => {
      const tr = document.createElement('tr');
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
    document.querySelectorAll('.editBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const course = courses.find(c => c.id == btn.dataset.id);
        const newTitle = prompt('Course Title', course.title);
        const newInstructor = prompt('Instructor Name', course.instructor);
        const newCategory = prompt('Category', course.category);
        const newPrice = prompt('Price', course.price);
        const newDuration = prompt('Duration', course.duration);
        const newDescription = prompt('Description', course.description);
        const newContent = prompt('Content URL', course.content);

        if (!newTitle || !newInstructor || !newCategory || !newPrice || !newDuration) return;

        // منع تكرار العنوان
        if (courses.some(c => c.title.toLowerCase() === newTitle.toLowerCase() && c.id != course.id)) {
          errorMsg.textContent = 'Course title already exists!';
          successMsg.textContent = '';
          return;
        }

        // منع الأرقام السالبة
        if (Number(newPrice) < 0) {
          errorMsg.textContent = 'Price cannot be negative!';
          successMsg.textContent = '';
          return;
        }

        course.title = newTitle.trim();
        course.instructor = newInstructor.trim();
        course.category = newCategory;
        course.price = Number(newPrice);
        course.duration = newDuration.trim();
        course.description = newDescription.trim();
        course.content = newContent.trim();

        localStorage.setItem('courses', JSON.stringify(courses));
        successMsg.textContent = 'Course updated successfully!';
        errorMsg.textContent = '';
        renderCourses();
      });
    });

    // Delete
    document.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        courses = courses.filter(c => c.id != btn.dataset.id);
        localStorage.setItem('courses', JSON.stringify(courses));
        successMsg.textContent = 'Course deleted successfully!';
        errorMsg.textContent = '';
        renderCourses();
      });
    });
  }

  addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const instructor = instructorInput.value.trim();
    const category = categorySelect.value;
    const price = priceInput.value.trim();
    const duration = durationInput.value.trim();
    const description = descriptionInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !instructor || !category || !price || !duration || !description) {
      errorMsg.textContent = 'Please fill all required fields!';
      successMsg.textContent = '';
      return;
    }

    // منع التكرار
    if (courses.some(c => c.title.toLowerCase() === title.toLowerCase())) {
      errorMsg.textContent = 'Course title already exists!';
      successMsg.textContent = '';
      return;
    }

    // منع الأرقام السالبة
    if (Number(price) < 0) {
      errorMsg.textContent = 'Price cannot be negative!';
      successMsg.textContent = '';
      return;
    }

    const newCourse = {
      id: 'co' + Date.now(),
      title,
      instructor,
      category,
      price: Number(price),
      duration,
      description,
      content
    };

    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));

    titleInput.value = '';
    instructorInput.value = '';
    categorySelect.value = '';
    priceInput.value = '';
    durationInput.value = '';
    descriptionInput.value = '';
    contentInput.value = '';

    successMsg.textContent = 'Course added successfully!';
    errorMsg.textContent = '';
    renderCourses();
  });

  renderCourses();
});
