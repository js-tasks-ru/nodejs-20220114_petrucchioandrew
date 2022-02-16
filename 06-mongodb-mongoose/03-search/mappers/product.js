module.exports = function mapProduct(product) {
  return {
    id: product._id,
    title: product.title,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    description: product.description,
  };
};
