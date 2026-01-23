import { db } from "../firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const UserService = {
  async listStudents() {
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};