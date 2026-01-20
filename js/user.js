// js/user.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class User {
  constructor(id, name, email, password, role = 'student') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // لازم يكون role مش type
  }

  static async register(name, email, password, role = 'student') {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    await setDoc(doc(db, 'users', uid), {
      id: uid,
      name,
      email,
      role,
      createdAt: Date.now()
    });
    return { id: uid, name, email, role };
  }

  static async login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const snap = await getDoc(doc(db, 'users', uid));
    const data = snap.exists() ? snap.data() : null;
    if (!data) throw 'User data not found';
    return data;
  }
  static async logout() {
    await signOut(auth);
  }

  static currentUser() {
    return auth.currentUser;
  }
}
