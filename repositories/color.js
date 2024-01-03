import Exception from '../exceptions/Exception.js';
import { Color } from '../models/index.js';

const getColors = async () => {
  try {
    const colors = await Color.findAll({
      order: [['colorId', 'ASC']],
    });

    return colors;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

export default {
  getColors,
};
