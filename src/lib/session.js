export const get = (key) => {
  const value = sessionStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return value;
};

export const set = (key, value) => {
  const prev = get(key);
  sessionStorage.setItem(key, JSON.stringify({ ...prev, ...value }));
};
