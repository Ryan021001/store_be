import { Op } from 'sequelize';
import Exception from '../exceptions/Exception.js';
import {
  Category,
  Color,
  Favorite,
  Product,
  ProductColor,
} from '../models/index.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import sequelize from '../database/sequelize.js';

const getProducts = async (limit, page, keyword, categoryId) => {
  try {
    const offset = (page - 1) * limit;

    const whereCondition = {
      name: {
        [Op.like]: `%${keyword}%`,
      },
    };

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    const products = await Product.findAll({
      where: whereCondition,
      order: [['productId', 'ASC']],
      limit: limit,
      offset: offset,
      attributes: [
        'productId',
        'name',
        'description',
        'price',
        'quantity',
        'image',
        [
          sequelize.fn(
            'to_char',
            sequelize.col('createdAt'),
            'YYYY-MM-DD HH24:MI:SS'
          ),
          'createdAt',
        ],
        [
          sequelize.fn(
            'to_char',
            sequelize.col('updatedAt'),
            'YYYY-MM-DD HH24:MI:SS'
          ),
          'updatedAt',
        ],
      ],
      include: [
        {
          model: ProductColor,
          attributes: ['productColorId'],
          include: [
            {
              model: Color,
            },
          ],
        },
        {
          model: Category,
        },
      ],
    });

    // Use map with Promise.all to update each instance
    await Promise.all(
      products.map(async (item) => {
        const newName = item.name.toLowerCase();
        item.name = newName;
        await item.save(); // Save each instance separately
      })
    );

    products.forEach((item) => {
      const colorList = item.productColors.map((item) => {
        return item.color;
      });
      item.dataValues.productColors = colorList;
    });

    return products;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const getProductById = async (productId, userId) => {
  try {
    const product = await Product.findByPk(productId, {
      attributes: [
        'productId',
        'name',
        'description',
        'price',
        'quantity',
        'image',
      ],
      include: [
        {
          model: ProductColor,
          attributes: ['productColorId'],
          include: [
            {
              model: Color,
            },
          ],
        },
        {
          model: Category,
        },
      ],
    });
    if (!product) {
      throw new Exception(
        Exception.CANNOT_FIND_PRODUCT_BY_ID + ': ' + productId
      );
    }

    const colorList = product.productColors.map((item) => {
      return item.color;
    });
    product.dataValues.productColors = colorList;

    const favorite = await Favorite.findOne({ where: { userId, productId } });
    product.dataValues.favorite = favorite ? true : false;
    return product;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const insertProduct = async ({
  name,
  description,
  colorList,
  price,
  quantity,
  categoryId,
  image,
}) => {
  try {
    let result = null;
    if (image) {
      result = await uploadToCloudinary(image);
    }
    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      categoryId,
      image: result.url,
    });

    const colorArray = colorList.split(',');
    await Promise.all(
      colorArray.map(
        async (item) =>
          await ProductColor.create({
            colorId: item,
            productId: product.productId,
          })
      )
    );

    return product;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const deleteProduct = async (productId) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Exception(Exception.PRODUCT_NOT_FOUND);
    }
    await product.destroy();
    return null;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const updateProduct = async ({
  productId,
  name,
  description,
  colorList,
  price,
  quantity,
  categoryId,
  image,
}) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Exception(Exception.PRODUCT_NOT_FOUND);
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.quantity = quantity ?? product.quantity;
    product.categoryId = categoryId ?? product.categoryId;

    const colorArray = (colorList || []).split(',');
    await ProductColor.destroy({
      where: {
        productId,
      },
    });

    await Promise.all(
      colorArray.map(
        async (item) =>
          await ProductColor.create({
            colorId: item,
            productId,
          })
      )
    );

    if (image) {
      const result = await uploadToCloudinary(image);
      product.image = result.url;
    }

    await product.save();
    return product;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const searchProducts = async (keyword, categoryId) => {
  try {
    const products = await Product.findAll({
      limit: 10,
      where: {
        name: {
          [Op.like]: `%${keyword}%`,
        },
        categoryId,
      },
      order: [['productId', 'ASC']],
      attributes: [
        'productId',
        'name',
        'description',
        'price',
        'quantity',
        'image',
      ],
      include: [
        {
          model: ProductColor,
          attributes: ['productColorId'],
          include: [
            {
              model: Color,
            },
          ],
        },
        {
          model: Category,
        },
      ],
    });

    products.forEach((item) => {
      const colorList = item.productColors.map((item) => {
        return item.color;
      });
      item.dataValues.productColors = colorList;
    });

    return products;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

export default {
  getProducts,
  insertProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  searchProducts,
};
