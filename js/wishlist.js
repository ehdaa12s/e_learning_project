class Wishlist {
  constructor(id, studentId) {
    this.id = id;
    this.studentId = studentId;
    this.courseIds = [];
  }

  addCourse(courseId) {
    this.courseIds.push(courseId);
  }

  removeCourse(courseId) {
    this.courseIds = this.courseIds.filter((id) => id !== courseId);
  }

  getWishlist() {
    return this.courseIds;
  }
}
export default Wishlist;