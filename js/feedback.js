class Feedback {
  constructor(id, studentId, courseId, rating, comment) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.rating = rating;
    this.comment = comment;
  }

  submitFeedback() {
    // TODO: store feedback
  }

  getCourseFeedback(courseId) {
    // TODO: retrieve all feedback for a course
  }
}

export default Feedback;
