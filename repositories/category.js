import Exception from '../exceptions/Exception.js';
import { Category } from '../models/index.js';
import uploadToCloudinary from '../utils/cloudinary.js';

const getCategories = async (limit, page) => {
  try {
    const offset = (page - 1) * limit;
    const categories = await Category.findAll({
      order: [['categoryId', 'ASC']],
      limit: limit,
      offset: offset,
    });

    return categories;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Exception(
        Exception.CANNOT_FIND_CATEGORY_BY_ID + ': ' + categoryId
      );
    }
    return category;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const insertCategory = async ({ name, image }) => {
  try {
    const result = await uploadToCloudinary(image);
    const category = await Category.create({
      name,
      image: result.url,
    });
    if (!category) {
      throw new Exception(Exception.CANNOT_INSERT_CATEGORY);
    }

    return category;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Exception(Exception.CATEGORY_NOT_FOUND);
    }
    await category.destroy();
    return null;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const updateCategory = async ({ categoryId, name, image }) => {
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Exception(Exception.CATEGORY_NOT_FOUND);
    }
    category.name = name ?? category.name;
    if (image) {
      const result = await uploadToCloudinary(image);
      category.image = result.url;
    }
    await category.save();
    return category;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

export default {
  getCategories,
  insertCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
};
