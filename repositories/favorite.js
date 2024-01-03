import { BaseUrl } from '../Global/constants.js';
import Exception from '../exceptions/Exception.js';
import { Favorite, Product } from '../models/index.js';

const getFavoritesByUserId = async (userId, limit, page) => {
  try {
    const offset = (page - 1) * limit;
    const favorites = await Favorite.findAll({
      where: {
        userId: userId,
      },
      limit: limit,
      offset: offset,
      attributes: ['favoriteId', 'userId'],
      include: { model: Product },
      order: [['favoriteId', 'ASC']],
    });

    return favorites;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const insertFavorite = async ({ userId, productId }) => {
  try {
    const favorite = await Favorite.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (favorite) {
      await favorite.destroy();
      return null;
    }
    const insertFavorite = await Favorite.create({
      userId,
      productId,
    });
    return insertFavorite;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

export default {
  getFavoritesByUserId,
  insertFavorite,
};
