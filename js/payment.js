import { auth, db } from './firebase.js';
import { renderPayPalButton } from '../lib/paypal.js';
import { addDoc, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function setupPaymentUI({ containerId, course, paypalClientId }) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');
  const amount = Number(course.price || 0);

  if (amount <= 0) {
    await enrollUser({ userId: user.uid, courseId: course.id });
    const c = document.getElementById(containerId);
    if (c) c.innerHTML = '<div class="success">Enrolled for free</div>';
    return;
  }

  await renderPayPalButton({
    containerId,
    amount,
    clientId: paypalClientId || window.__PAYPAL_CLIENT_ID,
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


/*
// js/payment_progress.js
import { DB } from "./db.js";

export class Payment {
  constructor(id, studentId, courseId, amount, paymentMethod) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
  }

  confirmPayment() {
    const payments = DB.getPayments();
    payments.push(this);
    DB.savePayments(payments);
    return true;
  }
}

export class Progress {
  constructor(id, studentId, courseId) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.completedModules = [];
    this.completionRate = 0;
  }

  updateProgress(moduleId) {
    if (!this.completedModules.includes(moduleId)) {
      this.completedModules.push(moduleId);
    }
  }
}*/