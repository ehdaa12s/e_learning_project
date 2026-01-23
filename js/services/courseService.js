import { db } from "../firebase.js";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const CourseService = {
  async getAll() {
    const snap = await getDocs(collection(db, 'courses'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async getById(id) {
    const s = await getDoc(doc(db, 'courses', id));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  },
  async findById(id) {
    return await this.getById(id);
  },
  async create(data) {
    const ref = await addDoc(collection(db, 'courses'), { ...data, createdAt: Date.now() });
    return ref.id;
  },
  async update(id, data) {
    await updateDoc(doc(db, 'courses', id), data);
  },
  async delete(id) {
    await deleteDoc(doc(db, 'courses', id));
  }
};