// db.js
const DB = {
  getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
  saveUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),

  getCourses: () => JSON.parse(localStorage.getItem('courses')) || [],
  saveCourses: (courses) => localStorage.setItem('courses', JSON.stringify(courses)),

  getCategories: () => JSON.parse(localStorage.getItem('categories')) || [],
  saveCategories: (categories) => localStorage.setItem('categories', JSON.stringify(categories)),

  getEnrollments: () => JSON.parse(localStorage.getItem('enrollments')) || [],
  saveEnrollments: (enrollments) => localStorage.setItem('enrollments', JSON.stringify(enrollments)),

  getFeedback: () => JSON.parse(localStorage.getItem('feedback')) || [],
  saveFeedback: (feedback) => localStorage.setItem('feedback', JSON.stringify(feedback)),

  getCertificates: () => JSON.parse(localStorage.getItem('certificates')) || [],
  saveCertificates: (certificates) => localStorage.setItem('certificates', JSON.stringify(certificates)),

  getPayments: () => JSON.parse(localStorage.getItem('payments')) || [],
  savePayments: (payments) => localStorage.setItem('payments', JSON.stringify(payments)),
};
export default DB;
