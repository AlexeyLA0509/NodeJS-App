'use strict';

const crypto = require('crypto');

const AES_KEY_SIZE = 256;
const AES_BLOCK_SIZE = 128;

const aes = {};

/**
 * 
 * @param {String} data
 * @param {String} password
 * @param {String} salt
 * @param {Number} pbkdf2Iterations
 * @returns {Buffer}
 */
aes.encrypt = function (data, password, salt, pbkdf2Iterations) {

    let key = crypto.pbkdf2Sync(password, salt, pbkdf2Iterations, AES_KEY_SIZE / 8, 'sha512');
    let iv = crypto.pbkdf2Sync(password, salt, pbkdf2Iterations, AES_BLOCK_SIZE / 8, 'sha512');
    let dataBuffer = Buffer.from(data, 'utf8');

    return this.encryptToBuffer(dataBuffer, key, iv);
};

/**
 * 
 * @param {Buffer} data
 * @param {Buffer} key
 * @param {Buffer} iv
 * @returns {Buffer}
 */
aes.encryptToBuffer = function (data, key, iv) {
    if ((data == null) || (data.length < 1)) {
        throw new Error('Invalid \'data\' parameter.');
    }

    if ((key == null) || (key.length < 1)) {
        throw new Error('Invalid \'key\' parameter.');
    }

    if ((iv == null) || (iv.length < 1)) {
        throw new Error('Invalid \'iv\' parameter.');
    }

    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    /*
    let result = cipher.update(data, 'utf8', 'hex');
    result += cipher.final('hex');
    */
    let buf = cipher.update(data);
    let buf2 = cipher.final();
    let result = Buffer.concat([buf, buf2], buf.length + buf2.length);

    return result;
};

/**
 * 
 * @param {Buffer} data
 * @param {String} password
 * @param {String} salt
 * @param {Number} pbkdf2Iterations
 * @returns {Buffer}
 */
aes.decrypt = function (data, password, salt, pbkdf2Iterations) {
    let key = crypto.pbkdf2Sync(password, salt, pbkdf2Iterations, AES_KEY_SIZE / 8, 'sha512');
    let iv = crypto.pbkdf2Sync(password, salt, pbkdf2Iterations, AES_BLOCK_SIZE / 8, 'sha512');

    return this.decryptToBuffer(data, key, iv);
};

/**
 * 
 * @param {Buffer} data
 * @param {Buffer} key
 * @param {Buffer} iv
 * @returns {Buffer}
 */
aes.decryptToBuffer = function (data, key, iv) {
    if ((data == null) || (data.length < 1)) {
        throw new Error('Invalid \'data\' parameter.');
    }

    if ((key == null) || (key.length < 1)) {
        throw new Error('Invalid \'key\' parameter.');
    }

    if ((iv == null) || (iv.length < 1)) {
        throw new Error('Invalid \'iv\' parameter.');
    }

    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let buf = decipher.update(data);
    let buf2 = decipher.final();
    let result = Buffer.concat([buf, buf2], buf.length + buf2.length);

    return result;
};

module.exports = aes;