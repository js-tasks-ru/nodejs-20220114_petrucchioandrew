const mongoose = require('mongoose');
const connection = require('../libs/connection');

const basicSchemaDescription = {
  title: {
    type: String,
    required: true,
  },
};

const subCategorySchema = new mongoose.Schema({...basicSchemaDescription});

const categorySchema = new mongoose.Schema({
  ...basicSchemaDescription,
  subcategories: [subCategorySchema],
  // subcategories: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Subcategory',
  // }],
});

module.exports = connection.model('Category', categorySchema);
