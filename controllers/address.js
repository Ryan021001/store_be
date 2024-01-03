import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { addressRepository } from '../repositories/index.js';

async function getAddresses(req, res) {
  try {
    const { limit, page } = req.body;
    const addresses = await addressRepository.getAddresses(limit, page);
    res.status(HttpStatusCode.OK).json(addresses);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

const getAddressByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { limit, page } = req.query;
    const address = await addressRepository.getAddressByUserId(
      userId,
      limit,
      page
    );
    res.status(HttpStatusCode.OK).json(address);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

const getAddressById = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const address = await addressRepository.getAddressById(addressId);
    res.status(HttpStatusCode.OK).json(address);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

const insertAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      address,
      district,
      ward,
      province,
      userId,
      phoneNumber,
    } = req.body;
    const insertAddress = await addressRepository.insertAddress({
      firstName,
      lastName,
      address,
      district,
      ward,
      province,
      userId,
      phoneNumber,
    });

    res.status(HttpStatusCode.INSERT_OK).json(insertAddress);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
};

const getDefaultAddress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const address = await addressRepository.getDefaultAddress(userId);
    res.status(HttpStatusCode.OK).json(address);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

async function updateAddress(req, res) {
  try {
    const {
      addressId,
      firstName,
      lastName,
      address,
      district,
      phoneNumber,
      ward,
      province,
      isDefault,
    } = req.body;

    const updatedAddress = await addressRepository.updateAddress({
      addressId,
      firstName,
      lastName,
      address,
      phoneNumber,
      district,
      ward,
      province,
      isDefault,
    });

    res.status(HttpStatusCode.OK).json(updatedAddress);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

async function deleteAddress(req, res) {
  try {
    const addressId = req.params.addressId;
    const deleteAddress = await addressRepository.deleteAddress(addressId);
    res.status(HttpStatusCode.OK).json(deleteAddress);
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(exception.toString());
  }
}

export default {
  getAddressByUserId,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  insertAddress,
  getDefaultAddress,
};
