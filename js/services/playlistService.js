import { db } from "../firebase.js";
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const PlaylistService = {
  async listModules(courseId) {
    const snap = await getDocs(collection(db, `courses/${courseId}/modules`));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async addModule(courseId, module) {
    await addDoc(collection(db, `courses/${courseId}/modules`), module);
  },
  async deleteModule(courseId, moduleId) {
    await deleteDoc(doc(db, `courses/${courseId}/modules`, moduleId));
  }
};