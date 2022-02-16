module.exports = function mapCategory(category) {
  return {
    id: category._id,
    title: category.title,
    subcategories: category.subcategories.map((subcategory) => ({
      id: subcategory._id,
      title: subcategory.title,
    })),
  };
};
