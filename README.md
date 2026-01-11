Project: E-Learning System (JavaScript) 

1. Introduction 

1.1 Purpose 

The purpose of this project is to develop a web-based E-Learning System that allows two types of users: Admin and Student. The system enables Admins to manage courses, categories, and student progress, while Students can browse, enroll, and track learning progress. The system aims to provide a seamless learning experience, incorporating course content such as videos, PDFs, and quizzes, with optional payment integration and certificates for course completion. 

1.2 Scope 

The system will provide: 

Authentication: Secure login and registration for Admin and Students, with validation and clear error messages. 
Admin Functions: 

Full CRUD operations for courses and categories. 
Manage student progress and course registrations. 
Student Functions: 

View courses with search and filtering. 
Enroll in courses and track progress. 
Add courses to wishlist and view learning history. 
Optional: Rate courses and receive certificates. 

Database: Local Storage or Firebase Realtime Database. 
Deployment: Project hosted on GitHub Pages. 
UI Design: Custom, with suitable colors, fonts, and layouts; no external themes allowed. 
2. Requirement Elicitation Techniques 

The following techniques were used to gather requirements: 

Stakeholder Interviews: Discussions with potential users (students and admins) to identify key features. 

Observation: Studying existing e-learning systems to understand necessary functionalities. 

Document Analysis: Reviewing course content and student management workflows. 

Brainstorming Sessions: Identifying optional and bonus features such as feedback system and certificates. 

 

3. Overall Description. 

3.1 Product Perspective  

The E-Learning System is a web-based platform designed as a stand-alone application. It interacts with users via a browser and stores data in Local Storage or Firebase Realtime Database. The product integrates with optional payment gateways (PayPal/Stripe) for paid courses and can provide downloadable certificates for completed courses. 

Interfaces: 

User Interface: HTML, CSS, JS based dashboards for Admin and Student. 

Database Interface: Local Storage or Firebase API. 

Payment Interface: PayPal/Stripe API (optional). 

 

3.2 Product Functions 

Key product functions include: 

Authentication: Login, registration, logout, validation. 
Course Management (Admin): Add, edit, delete, and view courses and categories. 
Student Management (Admin): View student progress and approve/reject enrollments. 
Course Access (Student): Browse, search, filter, enroll, view course content, track progress, wishlist, and history. 
Optional Features: Payment integration, feedback/rating system, certificates. 
 
