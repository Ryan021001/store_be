import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { cartRepository } from '../repositories/index.js';

async function getCartsByUserId(req, res) {
  try {
    const userId = req.params.userId;
    const carts = await cartRepository.getCartsByUserId(userId);
    res.status(HttpStatusCode.OK).json(carts);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

async function updateCartItem(req, res) {
  try {
    debugger;
    const updateCart = await cartRepository.updateCartItem(req.body);
    res.status(HttpStatusCode.OK).json(updateCart);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

const insertCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity, colorId } = req.body;

    const insertCart = await cartRepository.insertCartItem({
      productId,
      quantity,
      colorId,
      userId,
    });

    res.status(HttpStatusCode.INSERT_OK).json(insertCart);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

async function deleteCartItem(req, res) {
  try {
    const cartItemId = req.params.cartItemId;
    const deleteCart = await cartRepository.deleteCartItem(cartItemId);
    res.status(HttpStatusCode.OK).json(deleteCart);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

const checkEmptyCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const isEmpty = await cartRepository.checkEmptyCart(userId);
    res.status(HttpStatusCode.OK).json({ isEmpty: isEmpty });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

export default {
  getCartsByUserId,
  updateCartItem,
  deleteCartItem,
  insertCartItem,
  checkEmptyCart,
};
