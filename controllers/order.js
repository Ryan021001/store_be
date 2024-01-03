import { param } from 'express-validator';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { orderRepository } from '../repositories/index.js';

async function getOrders(req, res) {
  try {
    const { limit, page } = req.query;
    const orders = await orderRepository.getOrders(limit, page);
    res.status(HttpStatusCode.OK).json(orders);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

async function getOrderById(req, res) {
  debugger;
  try {
    const orderId = req.params.orderId;
    const order = await orderRepository.getOrderById(orderId);
    res.status(HttpStatusCode.OK).json(order);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { limit, page, status } = req.query;
    const orders = await orderRepository.getOrdersByUserId(
      userId,
      limit,
      page,
      status
    );
    res.status(HttpStatusCode.OK).json(orders);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

async function updateOrder(req, res) {
  try {
    debugger;
    const updateOrder = await orderRepository.updateOrder(req.body);
    res.status(HttpStatusCode.OK).json(updateOrder);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

const insertOrder = async (req, res) => {
  try {
    debugger;
    const { cartId, orderDate, userId, addressId } = req.body;

    const insertOrder = await orderRepository.insertOrder({
      cartId,
      orderDate,
      userId,
      addressId,
    });

    res.status(HttpStatusCode.INSERT_OK).json(insertOrder);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

async function deleteOrder(req, res) {
  try {
    const orderId = req.params.orderId;
    const deleteOrder = await orderRepository.deleteOrder(orderId);
    res.status(HttpStatusCode.OK).json(deleteOrder);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

export default {
  getOrdersByUserId,
  getOrderById,
  getOrders,
  updateOrder,
  deleteOrder,
  insertOrder,
};
