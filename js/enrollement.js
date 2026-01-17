class Enrollment {
  constructor(id, studentId, courseId, enrollDate, status) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.enrollDate = enrollDate;
    this.status = status; // pending, approved, rejected
  }

  approve() {
    this.status = "approved";
  }

  reject() {
    this.status = "rejected";
  }

  updateStatus(newStatus) {
    this.status = newStatus;
  }
}
export default Enrollment;