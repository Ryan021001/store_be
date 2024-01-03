import { decrypt, encrypt } from './aes_secrets.js';

const decryptUserInfo = (input) => {
    const decryptedUser = { ...input };
    ['name', 'phoneNumber'].forEach(field => {
        if (decryptedUser[field]) {
            decryptedUser[field] = decrypt(decryptedUser[field]);
        }
    });
    return decryptedUser;
}

const decryptUserInfos = (input) => {
    return input.map(field => {
        return decryptUserInfo(field)
    });
}


function encryptUserInfo (input) {
    const encryptedUser = { ...input };
    ['name', 'phoneNumber'].forEach(field => {
        if (encryptedUser[field]) {
            encryptedUser[field] = encrypt(encryptedUser[field]);
        }
    });
    return encryptedUser;
}

export {
    decryptUserInfo, decryptUserInfos, encryptUserInfo
};

