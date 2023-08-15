export const years = Array(5)
  .fill(null)
  .map((_, i) => new Date().getFullYear() - i);
