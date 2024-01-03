  import HttpStatusCode from '../exceptions/HttpStatusCode.js';
  import { productRepository } from '../repositories/index.js';

  async function getProducts(req, res) {
    try {
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;
      const keyword = req.query.keyword || '';
      const newKeyword = keyword.toLowerCase();
      const categoryId = Number(req.query.categoryId) || null;
      const products = await productRepository.getProducts(limit, page, newKeyword, categoryId);
      res.status(HttpStatusCode.OK).json(products);
    } catch (exception) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
    }
  }

  async function searchProducts(req, res) {
    try {
      const keyword = req.query.keyword || '';
      const categoryId = Number(req.query.categoryId) || null;
      const products = await productRepository.searchProducts(
        keyword,
        categoryId,
      );
      res.status(HttpStatusCode.OK).json(products);
    } catch (exception) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
    }
  }

  async function getProductById(req, res) {
    try {
      const productId = req.params.productId;
      const userId = req.query.userId;
      const product = await productRepository.getProductById(productId, userId);
      res.status(HttpStatusCode.OK).json(product);
    } catch (exception) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
    }
  }

  const insertProduct = async (req, res) => {
    try {
      debugger;
      const { file } = req;
      const { name, description, colorList, price, quantity, categoryId } =
        req.body;
      const newName = name.toLowerCase();

      const insertProduct = await productRepository.insertProduct({
        newName,
        description,
        colorList,
        price,
        quantity,
        categoryId,
        image: file,
      });
      res.status(HttpStatusCode.INSERT_OK).json(insertProduct);
    } catch (exception) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
    }
  };

  async function updateProduct(req, res) {
    try {
      debugger;
      const { file } = req || null;
      const {
        productId,
        name,
        description,
        colorList,
        price,
        quantity,
        categoryId,
      } = req.body;
      const updateProduct = await productRepository.updateProduct({
        productId,
        name,
        description,
        colorList,
        price,
        quantity,
        categoryId,
        image: file,
      });
      res.status(HttpStatusCode.OK).json(updateProduct);
    } catch (exception) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
    }
  }

  async function deleteProduct(req, res) {
    try {
      const productId = req.params.productId;
      const deleteProduct = await productRepository.deleteProduct(productId);
      res.status(HttpStatusCode.OK).json(deleteProduct);
    } catch (exception) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
    }
  }

  export default {
    searchProducts,
    getProducts,
    updateProduct,
    deleteProduct,
    insertProduct,
    getProductById,
  };
