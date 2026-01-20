import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class Category {
  constructor(id, name, description = "") {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static async getAll() {
    const snap = await getDocs(collection(db, "categories"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  static async create(name, description = "") {
    const categories = await Category.getAll();
    if (categories.some(c => (c.name || "").toLowerCase() === name.toLowerCase())) {
      throw "Category name already exists!";
    }
    const ref = await addDoc(collection(db, "categories"), {
      name,
      description,
      createdAt: Date.now()
    });
    return { id: ref.id, name, description };
  }

  static async update(id, newData) {
    const snap = await getDoc(doc(db, "categories", id));
    if (!snap.exists()) throw "Category not found";
    await updateDoc(doc(db, "categories", id), newData);
  }

  static async delete(id) {
    await deleteDoc(doc(db, "categories", id));
  }

  static async findById(id) {
    const snap = await getDoc(doc(db, "categories", id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }
}
