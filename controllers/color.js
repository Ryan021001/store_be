import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { colorRepository } from '../repositories/index.js';

async function getColors(req, res) {
  try {
    const colors = await colorRepository.getColors();
    res.status(HttpStatusCode.OK).json(colors);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

export default {
  getColors
};
