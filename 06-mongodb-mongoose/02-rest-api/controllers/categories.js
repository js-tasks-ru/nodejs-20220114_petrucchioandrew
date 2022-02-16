const Category = require('../models/Category');
const dbToResMapper = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesDb = await Category.find();

  ctx.body = {categories: categoriesDb.map(dbToResMapper)};
};
