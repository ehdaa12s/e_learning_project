import { Enrollment } from "./enrollement.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#enrollmentsTable tbody");

  async function renderEnrollments() {
    tableBody.innerHTML = "";

    const enrollments = await Enrollment.listAll?.();

    if (enrollments.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5" style="text-align:center">No enrollments found</td>`;
      tableBody.appendChild(tr);
      return;
    }

    // Render rows (lazy-load user/course names client-side if available)
    for (const enroll of enrollments) {
      const tr = document.createElement("tr");
      const created = enroll.createdAt ? new Date(enroll.createdAt).toLocaleString() : "-";
      tr.innerHTML = `
        <td>${enroll.id}</td>
        <td>${enroll.userName || enroll.userId || "Unknown User"}</td>
        <td>${enroll.courseTitle || enroll.courseId || "Unknown Course"}</td>
        <td>${created}</td>
        <td>
          <button class="deleteBtn" data-id="${enroll.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    }

    // Handle delete buttons
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const enrollId = btn.dataset.id;
        if (Enrollment.delete) {
          await Enrollment.delete(enrollId);
        }
        await renderEnrollments();
      });
    });
  }

  renderEnrollments();
});
