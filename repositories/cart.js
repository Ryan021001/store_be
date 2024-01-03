import Exception from '../exceptions/Exception.js';
import { Cart, CartItem, Color, Product, User } from '../models/index.js';

const getCartsByUserId = async (userId) => {
  try {
    const carts = await Cart.findOne({
      where: {
        userId,
      },
      attributes: ['cartId', 'total', 'quantity'],
      include: [
        {
          model: User,
          attributes: ['userId', 'name', 'email', 'phoneNumber'],
        },
        {
          model: CartItem,
          attributes: ['cartItemId', 'quantity'],
          include: [Product, Color],
          order: [['cartItemId', 'ASC']],
        },
      ],
    });
    return carts;
  } catch (exception) {
    throw new Error(exception.message);
  }
};

const insertCartItem = async ({ userId, productId, quantity, colorId }) => {
  try {
    let cart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        attributes: ['quantity'],
        include: { model: Product, attributes: ['price'] },
      },
    });

    if (!cart) {
      const newCart = await Cart.create({ userId, total: 0, quantity: 0 });
      cart = newCart;
    }

    const product = await Product.findByPk(productId);

    if (product.quantity < quantity) {
      throw new Exception(Exception.PRODUCT_NOT_ENOUGH);
    }

    const cartItemFind = await CartItem.findAll({
      cartId: cart.cartId,
      productId,
    });

    if (cartItemFind) {
      let quantityInCart = 0;
      cartItemFind.forEach((item) => {
        quantityInCart += item.quantity;
      });
      if (product.quantity < quantityInCart + quantity) {
        throw new Exception(Exception.PRODUCT_NOT_ENOUGH);
      }
    }

    const [cartItem, created] = await CartItem.findOrCreate({
      where: { productId, colorId, cartId: cart.cartId },
      defaults: { cartId: cart.cartId, productId, quantity, colorId },
    });

    if (!created && product.quantity < cartItem.quantity + quantity) {
      throw new Exception(Exception.PRODUCT_NOT_ENOUGH);
    }

    if (!created) {
      await cartItem.increment('quantity', { by: quantity });
    }

    const updatedCart = await Cart.findByPk(cart.cartId, {
      include: {
        model: CartItem,
        attributes: ['quantity'],
        include: { model: Product, attributes: ['price'] },
      },
    });

    if (!updatedCart) {
      throw new Exception(Exception.CART_NOT_FOUND);
    }

    updatedCart.total = Number(updatedCart.total);
    updatedCart.quantity = Number(updatedCart.quantity);

    if (updatedCart.cartItems) {
      updatedCart.cartItems.forEach((item) => {
        item.quantity = Number(item.quantity);
        item.product.price = Number(item.product.price);
      });
    }

    const totalInCart = updatedCart.cartItems.reduce(
      (acc, item) => acc + Number(item.quantity * item.product.price),
      0
    );
    const quantityInCart = updatedCart.cartItems.reduce(
      (acc, item) => acc + Number(item.quantity),
      0
    );

    await updatedCart.update({ total: totalInCart, quantity: quantityInCart });
    return cartItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCartItem = async (cartItemId) => {
  try {
    const cartItem = await CartItem.findByPk(cartItemId, {
      include: [{ model: Product }],
    });

    if (!cartItem) {
      throw new Exception(Exception.CART_ITEM_NOT_FOUND);
    }

    const cart = await Cart.findByPk(cartItem.cartId);

    if (!cart) {
      throw new Exception(Exception.CART_NOT_FOUND);
    }

    cart.quantity = Number(cart.quantity);
    cart.total = Number(cart.total);
    cartItem.quantity = Number(cartItem.quantity);
    cartItem.product.price = Number(cartItem.product.price);

    cart.quantity -= cartItem.quantity;
    cart.total -= cartItem.quantity * cartItem.product.price;

    await Promise.all([cart.save(), cartItem.destroy()]);
    return null;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const updateCartItem = async ({ cartItemId, quantity }) => {
  try {
    const cartItem = await CartItem.findByPk(cartItemId, {
      include: [{ model: Product }],
    });

    if (!cartItem) {
      throw new Exception(Exception.CART_ITEM_NOT_FOUND);
    }

    const quantityChange = quantity - cartItem.quantity;

    cartItem.quantity = quantity;

    const cart = await Cart.findByPk(cartItem.cartId);

    if (!cart) {
      throw new Exception(Exception.CART_NOT_FOUND);
    }

    const cartItemFind = await CartItem.findAll({
      cartId: cart.cartId,
      productId: cartItem.productId,
    });

    if (cartItemFind) {
      let quantityInCart = 0;
      cartItemFind.forEach((item) => {
        quantityInCart += item.quantity;
      });
      if (
        cartItem.product.quantity <
        quantityInCart + quantityChange
      ) {
        throw new Exception(Exception.PRODUCT_NOT_ENOUGH);
      }
    }

    cart.quantity = Number(cart.quantity);
    cart.total = Number(cart.total);
    cartItem.product.price = Number(cartItem.product.price);

    cart.quantity += quantityChange;
    cart.total += quantityChange * cartItem.product.price;

    await Promise.all([cart.save(), cartItem.save()]);
    return cartItem;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const checkEmptyCart = async (userId) => {
  try {
    const cart = await Cart.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: CartItem,
        },
      ],
    });

    return !cart || cart.cartItems.length === 0;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

export default {
  getCartsByUserId,
  insertCartItem,
  deleteCartItem,
  updateCartItem,
  checkEmptyCart,
};
