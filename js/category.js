import { DB } from "./db.js";

export class Category {
  constructor(id, name, description = "") {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static getAll() {
    return DB.getCategories();
  }

  static create(name, description = "") {
    const categories = DB.getCategories();

    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      throw "Category name already exists!";
    }

    const id = "c" + Date.now();
    const category = new Category(id, name, description);
    categories.push(category);
    DB.saveCategories(categories);
    return category;
  }

  static update(id, newData) {
    const categories = DB.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw "Category not found";

    categories[index] = { ...categories[index], ...newData };
    DB.saveCategories(categories);
  }

  static delete(id) {
    let categories = DB.getCategories();
    categories = categories.filter(c => c.id !== id);
    DB.saveCategories(categories);
  }

  static findById(id) {
    const categories = DB.getCategories();
    return categories.find(c => c.id === id);
  }
}
