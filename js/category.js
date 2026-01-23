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
    const trimmedName = name.trim();

    // Validation
    if (!trimmedName) throw "Category name cannot be empty!";
    if (trimmedName.length < 3) throw "Category name must be at least 3 characters!";
    if (/^\d/.test(trimmedName)) throw "Category name cannot start with a number!";
    if (categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      throw "Category name already exists!";
    }

    const id = "c" + Date.now();
    const category = new Category(id, trimmedName, description);
    categories.push(category);
    DB.saveCategories(categories);
    return category;
  }

  static update(id, newData) {
    const categories = DB.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw "Category not found";

    if (newData.name) {
      const trimmedName = newData.name.trim();

      // Validation
      if (!trimmedName) throw "Category name cannot be empty!";
      if (trimmedName.length < 3) throw "Category name must be at least 3 characters!";
      if (/^\d/.test(trimmedName)) throw "Category name cannot start with a number!";

      const duplicate = categories.some(
        c => c.name.toLowerCase() === trimmedName.toLowerCase() && c.id !== id
      );
      if (duplicate) throw "Category name already exists!";

      newData.name = trimmedName;
    }

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
