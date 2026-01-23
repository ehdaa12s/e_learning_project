import { DB } from "./db.js";

export class Certificate {
  constructor(id, studentId, courseId, issueDate) {
    this.id = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.issueDate = issueDate;
  }

  // make a certificate
  generateCertificate(studentName, courseTitle) {
    return `
      <div style="width: 800px; padding: 40px; text-align: center; border: 10px solid #3f37c9; border-radius: 20px; font-family: 'Segoe UI', sans-serif;">
        <h1 style="color: #3f37c9;">Certificate of Completion</h1>
        <p style="font-size: 18px; margin: 20px 0;">This certifies that</p>
        <h2 style="margin: 10px 0;">${studentName}</h2>
        <p style="font-size: 18px; margin: 20px 0;">has successfully completed the course</p>
        <h2 style="margin: 10px 0;">${courseTitle}</h2>
        <p style="margin-top: 30px;">Issued on: ${this.issueDate}</p>
      </div>
    `;
  }

  // download the certificate
  downloadCertificate(studentName, courseTitle) {
    const certHTML = this.generateCertificate(studentName, courseTitle);
    const newWindow = window.open("", "_blank");
    newWindow.document.write(certHTML);
    newWindow.document.close();
    newWindow.print(); // open the print window
  }

  // add certificate to DB
  static checkAndGenerate(student, course) {
    const progressKey = `progress_${student.id}_${course.id}`;
    const progressData = JSON.parse(localStorage.getItem(progressKey)) || { completed: [] };

    if (progressData.completed.length === course.content.length) {
      //check the certificate is not exist
      const existingCertificates = DB.getCertificates();
      const alreadyIssued = existingCertificates.find(c => c.studentId === student.id && c.courseId === course.id);
      if (!alreadyIssued) {
        const newCert = new Certificate(
          Date.now().toString(),
          student.id,
          course.id,
          new Date().toLocaleDateString()
        );

        DB.saveCertificates([...existingCertificates, newCert]);

        newCert.downloadCertificate(student.name, course.title);
      }
    }
  }
}
