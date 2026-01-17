import User from "./user";

class Student extends User {
    constructor(id, name, email, password) {
        super(id, name, email, password, 'student');
    }
  static enrollCourse(courseId) {
    const enrollments = DB.getEnrollments();
    const user = User.currentUser();
    if (!user) throw 'Login required';
    const id = Date.now();
    enrollments.push({ id, studentId: user.id, courseId, enrollDate: new Date(), status: 'pending' });
    DB.saveEnrollments(enrollments);
    return id;
  }

  static addToWishlist(courseId) {
    const user = User.currentUser();
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
    wishlist[user.id] = wishlist[user.id] || [];
    if (!wishlist[user.id].includes(courseId)) wishlist[user.id].push(courseId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  static removeFromWishlist(courseId) {
    const user = User.currentUser();
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
    wishlist[user.id] = wishlist[user.id]?.filter(id => id !== courseId) || [];
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  static trackProgress(courseId, moduleId) {
    const user = User.currentUser();
    const progress = JSON.parse(localStorage.getItem('progress')) || {};
    progress[user.id] = progress[user.id] || {};
    progress[user.id][courseId] = progress[user.id][courseId] || [];
    if (!progress[user.id][courseId].includes(moduleId)) progress[user.id][courseId].push(moduleId);
    localStorage.setItem('progress', JSON.stringify(progress));
  }

  static makePayment(courseId, amount) {
    const user = User.currentUser();
    const payments = DB.getPayments();
    const id = Date.now();
    payments.push({ id, studentId: user.id, courseId, amount, paymentDate: new Date(), paymentMethod: 'PayPal' });
    DB.savePayments(payments);
  }

  static submitFeedback(courseId, rating, comment) {
    const user = User.currentUser();
    const feedback = DB.getFeedback();
    feedback.push({ id: Date.now(), studentId: user.id, courseId, rating, comment });
    DB.saveFeedback(feedback);
  }

  static generateCertificate(courseId) {
    const user = User.currentUser();
    const certificates = DB.getCertificates();
    certificates.push({ id: Date.now(), studentId: user.id, courseId, issueDate: new Date() });
    DB.saveCertificates(certificates);
  }
}
export default Student;