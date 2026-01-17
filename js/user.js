
 export default class User {
  constructor(id, name, email, password, role = 'student') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static register(name, email, password, role = 'student') {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) throw 'Email already exists';
    const id = Date.now();
    const user = { id, name, email, password, role };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return user;
  }

  static login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw 'Invalid email or password';
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }

  static logout() {
    localStorage.removeItem('currentUser');
  }

  static currentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}

