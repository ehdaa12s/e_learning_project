import { db } from "../firebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function recordPayment({ userId, courseId, amount, provider, providerOrderId, status }) {
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