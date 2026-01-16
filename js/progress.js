class Progress {
  constructor(id, studentId, courseId) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.completedModules = [];
    this.completionRate = 0;
  }

  updateProgress(moduleId) {
    if (!this.completedModules.includes(moduleId)) {
      this.completedModules.push(moduleId);
      this.calculateCompletion();
    }
  }

  calculateCompletion() {

    
  }
}