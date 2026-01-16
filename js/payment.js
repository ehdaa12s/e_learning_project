class Payment {
  constructor(id, studentId, courseId, amount, paymentDate, paymentMethod) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.paymentMethod = paymentMethod;
  }

  validatePayment() {
    // TODO: implement validation
  }

  confirmPayment() {
    // TODO: implement confirmation logic
  }
}


export default Payment;