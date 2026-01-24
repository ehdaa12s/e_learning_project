export const DB = {
  getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
  saveUsers: users => localStorage.setItem('users', JSON.stringify(users)),

  getCategories: () => JSON.parse(localStorage.getItem('categories')) || [],
  saveCategories: categories => localStorage.setItem('categories', JSON.stringify(categories)),

  getCourses: () => JSON.parse(localStorage.getItem('courses')) || [],
  saveCourses: courses => localStorage.setItem('courses', JSON.stringify(courses)),

  getEnrollments: () => JSON.parse(localStorage.getItem('enrollments')) || [],
  saveEnrollments: enrollments => localStorage.setItem('enrollments', JSON.stringify(enrollments)),

  // Wishlist 
  getWishlist: () => JSON.parse(localStorage.getItem('wishlist')) || {},
  saveWishlist: wishlist => localStorage.setItem('wishlist', JSON.stringify(wishlist)),

  addToWishlist: (studentId, courseId) => {
    const wishlist = DB.getWishlist();
    if (!wishlist[studentId]) wishlist[studentId] = [];
    if (!wishlist[studentId].includes(courseId)) {
      wishlist[studentId].push(courseId);
      DB.saveWishlist(wishlist);
    }
  },

  removeFromWishlist: (studentId, courseId) => {
    const wishlist = DB.getWishlist();
    if (!wishlist[studentId]) return;
    wishlist[studentId] = wishlist[studentId].filter(id => id !== courseId);
    DB.saveWishlist(wishlist);
  },

  getPayments: () => JSON.parse(localStorage.getItem('payments')) || [],
  savePayments: payments => localStorage.setItem('payments', JSON.stringify(payments)),

  getFeedback: () => JSON.parse(localStorage.getItem('feedback')) || [],
  saveFeedback: feedback => localStorage.setItem('feedback', JSON.stringify(feedback)),

  getCertificates: () => JSON.parse(localStorage.getItem('certificates')) || [],
  saveCertificates: certificates => localStorage.setItem('certificates', JSON.stringify(certificates)),

  
  setCurrentUser: user => localStorage.setItem('currentUser', JSON.stringify(user)),
  getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser')),
  removeCurrentUser: () => localStorage.removeItem('currentUser'),
};
