class Certificate {
  constructor(id, studentId, courseId, issueDate) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.issueDate = issueDate;
  }

  downloadCertificate() {
    // TODO: implement download logic
  }

  generateCertificate() {
    // TODO: generate certificate (PDF or HTML)
  }
}