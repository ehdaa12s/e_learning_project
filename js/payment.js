import { auth, db } from './firebase.js';
import { renderPayPalButton } from '../lib/paypal.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadClientIdFromEnv() {
  try {
    const res = await fetch('/.env', { cache: 'no-store' });
    if (!res.ok) return null;
    const text = await res.text();
    const data = JSON.parse(text);
    const cid = data.client_id || null;
    if (cid) {
      window.__PAYPAL_CLIENT_ID = cid;
    }
    return cid;
  } catch (e) {
    console.warn('[payment] Failed to load client_id from .env:', e);
    return null;
  }
}

export async function setupPaymentUI({ containerId, course, paypalClientId }) {
  const user = auth.currentUser;
  const container = document.getElementById(containerId);
  if (!user) {
    if (container) container.innerHTML = '<div class="error">Please login to proceed with payment</div>';
    return;
  }
  const amount = Number(course.price || 0);

  if (amount <= 0) {
    await enrollUser({ userId: user.uid, courseId: course.id });
    const c = document.getElementById(containerId);
    if (c) c.innerHTML = '<div class="success">Enrolled for free</div>';
    return;
  }

  let clientId = paypalClientId || window.__PAYPAL_CLIENT_ID;
  if (!clientId || clientId === 'app_id') {
    // Try loading from .env
    clientId = await loadClientIdFromEnv();
  }
  if (!clientId || clientId === 'app_id') {
    if (container) container.innerHTML = '<div class="error">PayPal not configured. Please set your PayPal Client ID.</div>';
    return;
  }

  try {
    await renderPayPalButton({
      containerId,
      amount,
      clientId,
      onApprove: async ({ details }) => {
        await recordPayment({
          userId: user.uid,
          courseId: course.id,
          amount,
          provider: 'paypal',
          providerOrderId: details?.id,
          status: details?.status || 'COMPLETED'
        });
        await enrollUser({ userId: user.uid, courseId: course.id });
        const c = document.getElementById(containerId);
        if (c) c.innerHTML = '<div class="success">Payment successful. Enrolled!</div>';
      },
      onError: (err) => {
        console.error('[Payment] PayPal error:', err);
        const c = document.getElementById(containerId);
        if (c) c.innerHTML = '<div class="error">Payment failed. Try again.</div>';
      }
    });
  } catch (err) {
    console.error('[Payment] Failed to render PayPal button:', err);
    if (container) container.innerHTML = '<div class="error">Unable to initialize PayPal. Check configuration.</div>';
  }
}

async function recordPayment({ userId, courseId, amount, provider, providerOrderId, status }) {
  await addDoc(collection(db, 'payments'), {
    userId,
    courseId,
    amount,
    provider,
    providerOrderId,
    status,
    createdAt: Date.now()
  });
}

async function enrollUser({ userId, courseId }) {
  await addDoc(collection(db, 'enrollments'), {
    userId,
    courseId,
    status: 'approved',
    createdAt: Date.now()
  });
}

