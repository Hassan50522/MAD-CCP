// src/utils/api.js
export const fetchCategories = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["Academic", "Personal", "Work"]);
      }, 1000);
    });
  };
  