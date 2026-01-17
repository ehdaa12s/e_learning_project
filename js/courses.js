class Course {
  constructor(
    id,
    title,
    image,
    category,
    instructorName,
    description,
    price,
    duration,
    content
  ) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.category = category; // Category object or id
    this.instructorName = instructorName;
    this.description = description;
    this.price = price;
    this.duration = duration;
    this.content = content; // array of content objects (videos, PDFs, quizzes)
  }
  getCourseDetails() {}
  updateContent(newContent) {}
}
export default Course;
