import { auth } from './firebase.js';
import { CourseService } from './services/courseService.js';
import { FeedbackService } from './services/feedbackService.js';

document.addEventListener('DOMContentLoaded', () => {
  const courseTitle = document.getElementById('courseTitle');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const completeBtn = document.getElementById('completeBtn');
  const videoFrame = document.getElementById('videoFrame');

  let course = null;
  let modules = [];
  let index = 0;
  let completedCount = 0;

  function getCourseId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('courseId');
  }

  function updateProgressUI() {
    const total = modules.length || 1;
    const rate = Math.min(100, Math.round((completedCount / total) * 100));
    progressFill.style.width = rate + '%';
    progressText.textContent = rate + '%';
  }

  function renderModule() {
    if (!modules.length) {
      videoFrame.src = '';
      return;
    }
    const m = modules[index];
    videoFrame.src = m?.url || m?.video || '';
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= modules.length - 1;
  }

  function showRatingPrompt() {
    const modal = document.createElement('div');
    modal.className = 'course-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-btn">&times;</button>
        <h3>Rate this course</h3>
        <label>Rating (1-5):
          <select id="ratingInput">
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label style="display:block;margin-top:10px;">Feedback:
          <textarea id="commentInput" rows="4" style="width:100%" placeholder="Share your thoughts"></textarea>
        </label>
        <div class="modal-actions" style="margin-top:10px;">
          <button id="submitFeedbackBtn">Submit</button>
          <button class="cancel-btn">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('.close-btn')?.addEventListener('click', close);
    modal.querySelector('.cancel-btn')?.addEventListener('click', close);
    modal.querySelector('#submitFeedbackBtn')?.addEventListener('click', async () => {
      const user = auth.currentUser;
      if (!user) {
        alert('Please login to submit feedback');
        return;
      }
      const rating = Number((modal.querySelector('#ratingInput')?.value) || 0);
      const comment = (modal.querySelector('#commentInput')?.value || '').trim();
      if (!rating || rating < 1 || rating > 5) {
        alert('Please select a rating between 1 and 5');
        return;
      }
      try {
        await FeedbackService.submit({ userId: user.uid, courseId: course.id, rating, comment });
        modal.querySelector('.modal-content').innerHTML = '<div class="success">Thanks for your feedback!</div>';
        setTimeout(close, 1200);
      } catch (e) {
        console.error('[feedback] submit failed', e);
        alert('Failed to submit feedback. Please try again later.');
      }
    });
  }

  async function init() {
    const id = getCourseId();
    if (!id) return;
    try {
      course = await CourseService.findById(id);
      courseTitle.textContent = course?.title || 'Course Content';
      modules = Array.isArray(course?.modules) ? course.modules : [];
      completedCount = 0;
      updateProgressUI();
      renderModule();
    } catch (e) {
      console.error('Failed to load course', e);
    }
  }

  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      renderModule();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (index < modules.length - 1) {
      index += 1;
      renderModule();
    }
  });

  completeBtn.addEventListener('click', () => {
    // Naive completion model: mark current module as completed
    completedCount = Math.min(modules.length || 1, completedCount + 1);
    updateProgressUI();

    // If all modules completed, prompt for rating
    const allDone = (modules.length ? completedCount >= modules.length : completedCount >= 1);
    if (allDone) {
      showRatingPrompt();
    }
  });

  init();
});