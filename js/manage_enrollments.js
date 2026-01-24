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
          <span class="status">${enroll.status || 'approved'}</span>
          <button class="approveBtn" data-id="${enroll.id}">Approve</button>
          <button class="rejectBtn" data-id="${enroll.id}">Reject</button>
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
    // Handle approve/reject
    document.querySelectorAll('.approveBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await Enrollment.updateStatus(id, 'approved');
        await renderEnrollments();
      });
    });
    document.querySelectorAll('.rejectBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await Enrollment.updateStatus(id, 'rejected');
        await renderEnrollments();
      });
    });
