import { DB } from "./db.js";

export const Enrollment = {

  enroll(userId, courseId) {
    const enrollments = DB.getEnrollments();

    const exists = enrollments.some(
      e => e.userId === userId && e.courseId === courseId
    );
    if (exists) return;

    enrollments.push({
      id: Date.now(),
      userId,
      courseId,
      date: new Date().toISOString()
    });

    DB.saveEnrollments(enrollments);
  },

  isEnrolled(userId, courseId) {
    return DB.getEnrollments().some(
      e => e.userId === userId && e.courseId === courseId
    );
  }
};
