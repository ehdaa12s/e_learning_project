// js/wishlist.js
import { DB } from "./db.js";
import { User } from "./user.js";

export class Wishlist {
  constructor(studentId) {
    this.studentId = studentId;
    this.courseIds = this.loadWishlist();
  }

  loadWishlist() {
    const wishlistData = DB.getWishlist();
    return wishlistData[this.studentId] || [];
  }

  saveWishlist() {
    const wishlistData = DB.getWishlist();
    wishlistData[this.studentId] = this.courseIds;
    DB.saveWishlist(wishlistData);
  }

  addCourse(courseId) {
    if (!this.courseIds.includes(courseId)) {
      this.courseIds.push(courseId);
      this.saveWishlist();
    }
  }

  removeCourse(courseId) {
    this.courseIds = this.courseIds.filter(id => id !== courseId);
    this.saveWishlist();
  }

  getWishlist() {
    return this.courseIds;
  }

  static getCurrentStudentWishlist() {
    const user = User.currentUser();
    if (!user) throw 'Login required';
    return new Wishlist(user.id).getWishlist();
  }
}
