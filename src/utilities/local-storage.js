export const getData = (value) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(value);
    return JSON.parse(user);
  }
  return undefined;
};
