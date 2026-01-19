// js/admin.js
import { DB } from "./db.js";
import { User } from "./user.js";

export class Admin extends User {
  constructor(id, name, email, password) {
    super(id, name, email, password, 'admin');
  }

  static createCategory(name, description) {
    const categories = DB.getCategories();
    const id = Date.now();
    categories.push({ id, name, description });
    DB.saveCategories(categories);
    return id;
  }

  static updateCategory(id, newData) {
    const categories = DB.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if(index === -1) throw 'Category not found';
    categories[index] = { ...categories[index], ...newData };
    DB.saveCategories(categories);
  }

  static deleteCategory(id) {
    const categories = DB.getCategories().filter(c => c.id !== id);
    DB.saveCategories(categories);
  }

  static createCourse(data) {
    const courses = DB.getCourses();
    const id = Date.now();
    const course = { id, ...data };
    courses.push(course);
    DB.saveCourses(courses);
    return id;
  }

  static updateCourse(id, data) {
    const courses = DB.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if(index === -1) throw 'Course not found';
    courses[index] = { ...courses[index], ...data };
    DB.saveCourses(courses);
  }

  static deleteCourse(id) {
    const courses = DB.getCourses().filter(c => c.id !== id);
    DB.saveCourses(courses);
  }

  static approveEnrollment(enrollmentId) {
    const enrollments = DB.getEnrollments();
    const e = enrollments.find(en => en.id === enrollmentId);
    if(!e) throw 'Enrollment not found';
    e.status = 'approved';
    DB.saveEnrollments(enrollments);
  }

  static rejectEnrollment(enrollmentId) {
    const enrollments = DB.getEnrollments();
    const e = enrollments.find(en => en.id === enrollmentId);
    if(!e) throw 'Enrollment not found';
    e.status = 'rejected';
    DB.saveEnrollments(enrollments);
  }

  static viewStudentProgress(studentId) {
    return DB.getEnrollments().filter(en => en.studentId === studentId);
  }
}
