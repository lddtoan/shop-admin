export const getProducts = async () => {
  const response = await fetch(`https://dummyjson.com/products?limit=100`);
  const data = await response.json();
  return data.products;
};
