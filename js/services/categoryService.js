import { db } from "../firebase.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const CategoryService = {
  async getAll() {
    const snap = await getDocs(collection(db, 'categories'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async findById(id) {
    const s = await getDoc(doc(db, 'categories', id));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  },
  async create({ name, description = "" }) {
    const ref = await addDoc(collection(db, 'categories'), { name, description, createdAt: Date.now() });
    return ref.id;
  },
  async update(id, data) {
    await updateDoc(doc(db, 'categories', id), data);
  },
  async delete(id) {
    await deleteDoc(doc(db, 'categories', id));
  }
};