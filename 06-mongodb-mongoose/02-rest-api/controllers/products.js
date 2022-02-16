const Product = require('../models/Product');
const dbToResMapper = require('../mappers/product');
const dbUtils = require('../utils/db');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();
  if (!dbUtils.isObjectIdValid(subcategory)) {
    ctx.status = 400;
    ctx.body = 'Bad request';
    return;
  }

  const products = await Product.find({subcategory: {_id: subcategory}});

  ctx.body = {products: products.map(dbToResMapper)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = { products: products.map(dbToResMapper) };
};

module.exports.productById = async function productById(ctx, next) {
  const { id } = ctx.params;

  if (!dbUtils.isObjectIdValid(id)) {
    ctx.status = 400;
    ctx.body = 'Bad request';
    return;
  }

  const product = await Product.findOne({_id: id});

  if (!product) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  ctx.body = { product: dbToResMapper(product) };
};
