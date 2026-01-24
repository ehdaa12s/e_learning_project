import { DB } from "./db.js";
import { hashPassword } from "./utils.js";

export class User {
  constructor(id, name, email, password, role = "student") {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  // Register
  static async register(name, email, password, role = "student") {
    const users = DB.getUsers();

    // Validation
    if (!name || name.length < 3)
      throw new Error("Name must be at least 3 characters");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      throw new Error("Invalid email");

    if (!password || password.length < 6)
      throw new Error("Password must be at least 6 characters");

    if (!["student", "admin"].includes(role))
      throw new Error("Invalid role");

    if (users.some(u => u.email === email))
      throw new Error("Email already exists");

    const hashedPassword = await hashPassword(password);

    const user = new User(
      "u" + Date.now(),
      name,
      email,
      hashedPassword,
      role
    );

    users.push(user);
    DB.saveUsers(users);

    return user;
  }

  // Login
  static async login(email, password) {
    const users = DB.getUsers();
    const hashedPassword = await hashPassword(password);

    const user = users.find(
      u => u.email === email && u.password === hashedPassword
    );

    if (!user)
      throw new Error("Invalid email or password");

    return user;
  }

  static logout() {
    DB.removeCurrentUser();
  }

  static currentUser() {
    return DB.getCurrentUser();
  }
}
