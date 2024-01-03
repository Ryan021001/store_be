import Exception from '../exceptions/Exception.js';
import {
  Address,
  Cart,
  CartItem,
  Color,
  Order,
  OrderItem,
  Product,
  User,
} from '../models/index.js';

const getOrders = async (limit, page) => {
  try {
    const offset = (page - 1) * limit;
    const orders = await Order.findAll({
      limit,
      offset,
      attributes: [
        'orderId',
        'total',
        'quantity',
        'orderDate',
        'status',
        'firstName',
        'lastName',
        'address',
        'district',
        'ward',
        'province',
        'phoneNumber',
      ],
      order: [['orderId', 'ASC']],
      include: [
        {
          model: User,
          attributes: ['userId', 'name', 'email', 'phoneNumber'],
        },
        {
          model: OrderItem,
          attributes: ['orderItemId', 'quantity'],
          include: [Product, Color],
          order: [['orderItemId', 'ASC']],
        },
      ],
    });

    return orders;
  } catch (exception) {
    throw new Error(exception.message);
  }
};

const getOrdersByUserId = async (userId, limit, page, status) => {
  try {
    const offset = (page - 1) * limit;
    const orders = await Order.findAll({
      where: {
        userId,
        status,
      },
      limit,
      offset,
      order: [['orderId', 'DESC']],
      // attributes: ['orderId', 'total', 'quantity', 'status', 'orderDate'],
      include: [
        {
          model: OrderItem,
          attributes: ['orderItemId', 'quantity'],
          include: [Product, Color],
          order: [['orderItemId', 'ASC']],
        },
      ],
    });

    return orders;
  } catch (exception) {
    throw new Error(exception.message);
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId, {
      attributes: [
        'orderId',
        'total',
        'quantity',
        'orderDate',
        'status',
        'firstName',
        'lastName',
        'address',
        'district',
        'ward',
        'province',
        'phoneNumber',
      ],
      include: [
        {
          model: User,
          attributes: ['userId', 'name', 'email', 'phoneNumber'],
        },
        {
          model: OrderItem,
          attributes: ['orderItemId', 'quantity'],
          include: [Product, Color],
          order: [['orderItemId', 'ASC']],
        },
      ],
    });

    return order;
  } catch (exception) {
    throw new Error(exception.message);
  }
};

const insertOrder = async ({ cartId, orderDate, userId, addressId }) => {
  try {
    const cart = await Cart.findOne({
      where: {
        cartId,
      },
      include: [
        {
          model: CartItem,
          include: [Product, Color],
        },
      ],
    });

    if (!cart) {
      throw new Error(Exception.CART_NOT_FOUND);
    }

    const address = await Address.findByPk(addressId);

    if (!address) {
      throw new Error(Exception.CANNOT_FIND_ADDRESS_BY_ID + ': ' + addressId);
    }

    const order = await Order.create({
      total: cart.total,
      quantity: cart.quantity,
      orderDate,
      userId,
      status: 0,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      district: address.district,
      ward: address.ward,
      province: address.province,
      phoneNumber: address.phoneNumber,
    });

    if (!order) {
      throw new Error(Exception.CANNOT_INSERT_ORDER);
    }

    if (cart.cartItems && cart.cartItems.length > 0) {
      await Promise.all(
        cart.cartItems.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          if (!product) {
            throw new Error(Exception.PRODUCT_NOT_FOUND);
          }

          if (product.quantity < item.quantity) {
            throw new Error(Exception.PRODUCT_NOT_ENOUGH);
          }

          const orderItemCreated = await OrderItem.create({
            orderId: order.orderId,
            productId: item.productId,
            quantity: item.quantity,
            colorId: item.colorId,
          });

          if (!orderItemCreated) {
            throw new Error(Exception.CANNOT_INSERT_ORDER);
          }

          product.quantity -= item.quantity;
          await product.save();
        })
      );
    }

    await cart.destroy();

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Exception(Exception.ORDER_NOT_FOUND);
    }
    await order.destroy();
    return null;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const updateOrder = async ({ orderId, status }) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Exception(Exception.ORDER_NOT_FOUND);
    }

    if (status !== null) {
      const orderItems = await OrderItem.findAll({
        where: { orderId },
      });

      await Promise.all(
        orderItems.map(async (orderItem) => {
          const product = await Product.findByPk(orderItem.productId);
          if (!product) {
            throw new Exception(Exception.PRODUCT_NOT_FOUND);
          }
          const orderQuantity = orderItem.quantity;
          if (status === 3 && order.status !== 3) {
            console.log(product);
            product.quantity += orderQuantity;
            console.log(product);
          } else if (order.status === 3 && status !== 3) {
            product.quantity -= orderQuantity;
          }
          await product.save();
        })
      );

      order.status = status;
      await order.save();
      return order;
    }
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

export default {
  getOrders,
  getOrdersByUserId,
  insertOrder,
  deleteOrder,
  updateOrder,
  getOrderById,
};
