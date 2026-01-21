import { DB } from "./db.js";

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

  static getAll() {
    return DB.getCourses();
  }

  static create(data) {
    const courses = DB.getCourses();

    // Required fields
    if (!data.title || !data.instructor || !data.category || !data.duration || !data.description || !data.content) {
      throw "All course fields must be filled!";
    }

    // Price check
    if (data.price < 0) throw "Price cannot be negative!";
    if (data.duration < 0) throw "duration cannot be negative!";

    // Duplicate check
    if (courses.some(c => c.title.toLowerCase() === data.title.toLowerCase())) {
      throw "Course title already exists!";
    }

    const id = "co" + Date.now();
    const course = new Course(id, data.title, data.instructor, data.category, data.price, data.duration, data.description, data.content);
    courses.push(course);
    DB.saveCourses(courses);
    return course;
  }

  static update(id, newData) {
    const courses = DB.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) throw "Course not found";

    if (!newData.title || !newData.instructor || !newData.category || !newData.duration || !newData.description || !newData.content) {
      throw "All course fields must be filled!";
    }
    if (newData.price < 0) throw "Price cannot be negative!";
    if (courses.some(c => c.title.toLowerCase() === newData.title.toLowerCase() && c.id !== id)) {
      throw "Course title already exists!";
    }

    courses[index] = { ...courses[index], ...newData };
    DB.saveCourses(courses);
  }

  static delete(id) {
    let courses = DB.getCourses();
    courses = courses.filter(c => c.id !== id);
    DB.saveCourses(courses);
  }

  static findById(id) {
    const courses = DB.getCourses();
    return courses.find(c => c.id === id);
  }
}


