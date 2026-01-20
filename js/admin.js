import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class Admin {

  static async createCategory(name, description) {
    const ref = await addDoc(collection(db, "categories"), {
      name,
      description,
      createdAt: Date.now()
    });
    return ref.id;
  }

  static async updateCategory(id, data) {
    await updateDoc(doc(db, "categories", id), data);
  }

  static async deleteCategory(id) {
    await deleteDoc(doc(db, "categories", id));
  }


  static async createCourse(data) {
    const ref = await addDoc(collection(db, "courses"), {
      ...data,
      createdAt: Date.now()
    });
    return ref.id;
  }

  static async updateCourse(id, data) {
    await updateDoc(doc(db, "courses", id), data);
  }

  static async deleteCourse(id) {
    await deleteDoc(doc(db, "courses", id));
  }


  static async approveEnrollment(id) {
    await updateDoc(doc(db, "enrollments", id), {
      status: "approved"
    });
  }

  static async rejectEnrollment(id) {
    await updateDoc(doc(db, "enrollments", id), {
      status: "rejected"
    });
  }

  static async viewStudentProgress(studentId) {
    const q = query(
      collection(db, "enrollments"),
      where("studentId", "==", studentId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }
}
