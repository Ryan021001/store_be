import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { favoriteRepository } from '../repositories/index.js';

const getFavoritesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { limit, page } = req.query;
    const favorites = await favoriteRepository.getFavoritesByUserId(
      userId,
      limit,
      page
    );
    res.status(HttpStatusCode.OK).json(favorites);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

const insertFavorite = async (req, res) => {
  try {
    debugger;
    const { userId, productId } = req.body;
    const insetFavorite = await favoriteRepository.insertFavorite({
      userId,
      productId,
    });
    res.status(HttpStatusCode.INSERT_OK).json(insetFavorite);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

export default {
  getFavoritesByUserId,
  insertFavorite,
};
