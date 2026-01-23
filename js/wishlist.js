import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class Wishlist {
  constructor(studentId) {
    this.studentId = studentId;
    this.courseIds = [];
  }

  async loadWishlist() {
    const snap = await getDoc(doc(db, "wishlists", this.studentId));
    const data = snap.exists() ? snap.data() : { courseIds: [] };
    this.courseIds = Array.isArray(data.courseIds) ? data.courseIds : [];
    return this.courseIds;
  }

  async saveWishlist() {
    await setDoc(doc(db, "wishlists", this.studentId), { courseIds: this.courseIds }, { merge: true });
  }

  async addCourse(courseId) {
    if (!this.courseIds.includes(courseId)) {
      this.courseIds.push(courseId);
      await this.saveWishlist();
    }
  }

  async removeCourse(courseId) {
    this.courseIds = this.courseIds.filter(id => id !== courseId);
    await this.saveWishlist();
  }

  async getWishlist() {
    return await this.loadWishlist();
  }

  static async getCurrentStudentWishlist() {
    const user = auth.currentUser;
    if (!user) throw new Error("Login required");
    const w = new Wishlist(user.uid);
    return await w.getWishlist();
  }
}
