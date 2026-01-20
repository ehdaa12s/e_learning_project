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

export class Course {
  constructor(id, title, instructor, category, price, duration, description, content) {
    this.id = id;
    this.title = title;
    this.instructor = instructor;
    this.category = category;
    this.price = price;
    this.duration = duration;
    this.description = description;
    this.content = content;
  }

  static async getAll() {
    const snap = await getDocs(collection(db, "courses"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  static async create(data) {
    // Required fields
    if (!data.title || !data.instructor || !data.category || !data.duration || !data.description || !data.content) {
      throw "All course fields must be filled!";
    }
    if (data.price < 0) throw "Price cannot be negative!";

    const courses = await Course.getAll();
    if (courses.some(c => (c.title || "").toLowerCase() === data.title.toLowerCase())) {
      throw "Course title already exists!";
    }

    const ref = await addDoc(collection(db, "courses"), {
      title: data.title,
      instructor: data.instructor,
      category: data.category,
      price: Number(data.price) || 0,
      duration: data.duration,
      description: data.description,
      content: data.content,
      createdAt: Date.now()
    });
    return { id: ref.id, ...data };
  }

  static async update(id, newData) {
    if (!newData.title || !newData.instructor || !newData.category || !newData.duration || !newData.description || !newData.content) {
      throw "All course fields must be filled!";
    }
    if (newData.price < 0) throw "Price cannot be negative!";

    const all = await Course.getAll();
    if (all.some(c => (c.title || "").toLowerCase() === newData.title.toLowerCase() && c.id !== id)) {
      throw "Course title already exists!";
    }

    await updateDoc(doc(db, "courses", id), {
      title: newData.title,
      instructor: newData.instructor,
      category: newData.category,
      price: Number(newData.price) || 0,
      duration: newData.duration,
      description: newData.description,
      content: newData.content
    });
  }

  static async delete(id) {
    await deleteDoc(doc(db, "courses", id));
  }

  static async findById(id) {
    const snap = await getDoc(doc(db, "courses", id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }
}
