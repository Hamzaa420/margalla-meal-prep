import { meals } from '../data/meals.js';

// Asynchronous mock loader. Pass { fail: true } to simulate a network error.
export function loadMeals({ fail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error('Could not load the menu.'));
      else resolve(meals.map((m) => ({ ...m })));
    }, 700);
  });
}
