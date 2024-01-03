import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { categoryRepository } from '../repositories/index.js';

async function getCategories(req, res) {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const categories = await categoryRepository.getCategories(limit, page);
    res.status(HttpStatusCode.OK).json(categories);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

async function getCategoryById(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const category = await categoryRepository.getCategoryById(categoryId);
    res.status(HttpStatusCode.OK).json(category);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

const insertCategory = async (req, res) => {
  try {
    debugger;
    const { file } = req;
    const { name } = req.body;

    const insertCategory = await categoryRepository.insertCategory({
      name,
      image: file,
    });
    res.status(HttpStatusCode.INSERT_OK).json(insertCategory);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

async function updateCategory(req, res) {
  try {
    debugger;
    const { file } = req;
    const { categoryId, name, description, colorList } = req.body;
    const updateCategory = await categoryRepository.updateCategory({
      categoryId,
      name,
      description,
      colorList,
      image: file,
    });
    res.status(HttpStatusCode.OK).json(updateCategory);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const deleteCategory = await categoryRepository.deleteCategory(categoryId);
    res.status(HttpStatusCode.OK).json(deleteCategory);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

export default {
  getCategories,
  updateCategory,
  deleteCategory,
  insertCategory,
  getCategoryById,
};
