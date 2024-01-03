import Exception from '../exceptions/Exception.js';
import { Address, User } from '../models/index.js';

const getAddresses = async (limit, page) => {
  try {
    const offset = (page - 1) * limit;
    const addresses = await Address.findAll({
      order: [['addressId', 'ASC']],
      limit: limit,
      offset: offset,
    });

    return addresses;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const getAddressByUserId = async (userId, limit, page) => {
  try {
    const offset = (page - 1) * limit;
    const addresses = await Address.findAll({
      where: {
        userId,
      },
      order: [
        ['isDefault', 'DESC'],
        ['addressId', 'ASC'],
      ],
      limit: limit,
      offset: offset,
    });

    return addresses;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const getDefaultAddress = async (userId) => {
  try {
    const address = await Address.findOne({
      where: {
        userId,
        isDefault: true,
      },
    });
    if (!address) {
      throw new Exception(Exception.CANNOT_FIND_DEFAULT_ADDRESS);
    }
    return address;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const getAddressById = async (addressId) => {
  try {
    const address = await Address.findByPk(addressId);
    if (!address) {
      throw new Exception(
        Exception.CANNOT_FIND_ADDRESS_BY_ID + ': ' + addressId
      );
    }
    return address;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const insertAddress = async ({
  firstName,
  lastName,
  address,
  district,
  ward,
  province,
  userId,
  phoneNumber,
}) => {
  try {
    const isDefault = false;
    const newAddress = await Address.create({
      firstName,
      lastName,
      address,
      district,
      ward,
      province,
      userId,
      phoneNumber,
      isDefault,
    });
    if (!newAddress) {
      throw new Exception(Exception.CANNOT_INSERT_ADDRESS);
    }
    return newAddress;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const deleteAddress = async (addressId) => {
  try {
    const address = await Address.findByPk(addressId);
    if (!address) {
      throw new Exception(Exception.ADDRESS_NOT_FOUND);
    }
    await address.destroy();
    return null;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const updateAddress = async ({
  addressId,
  firstName,
  lastName,
  address,
  district,
  ward,
  province,
  phoneNumber,
  isDefault,
}) => {
  try {
    const addressFound = await Address.findByPk(addressId);
    if (!addressFound) {
      throw new Exception(Exception.ADDRESS_NOT_FOUND);
    }
    addressFound.firstName = firstName ?? addressFound.firstName;
    addressFound.lastName = lastName ?? addressFound.lastName;
    addressFound.address = address ?? addressFound.address;
    addressFound.district = district ?? addressFound.district;
    addressFound.ward = ward ?? addressFound.ward;
    addressFound.province = province ?? addressFound.province;
    addressFound.phoneNumber = phoneNumber ?? addressFound.phoneNumber;

    if (isDefault) {
      const addressUser = await Address.findAll({
        where: { userId: addressFound.userId },
      });
      addressUser.forEach(async (address) => {
        if (address.addressId !== addressId) {
          address.isDefault = false;
        }
        await address.save();
      });
    }

    addressFound.isDefault = isDefault;

    await addressFound.save();

    return addressFound;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

export default {
  getAddresses,
  getAddressById,
  insertAddress,
  deleteAddress,
  updateAddress,
  getAddressByUserId,
  getDefaultAddress,
};
