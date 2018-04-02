'use strict';

const dataValidation = {};

const userNameRegex = /^[a-z0-9_]{3,30}$/i;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const passwordRegex = /^[\w|!#$%&*()/=+\-?]+$/;

/**
 * @param {String} userName
 * @returns {Boolean}
 */
dataValidation.isUserNameValid = function (userName) {
    if ((userName == null) || (typeof userName !== 'string') || (userName.length < 1)) {
        return false;
    }

    return userNameRegex.test(userName);
};

/**
 * @param {String} email
 * @returns {Boolean}
 */
dataValidation.isEmailValid = function (email) {
    if ((email == null) || (typeof email !== 'string') || (email.length < 1)) {
        return false;
    }

    return emailRegex.test(email);
};

/**
 * @param {String} password
 * @returns {Boolean}
 */
dataValidation.isPasswordValid = function (password) {
    if ((password == null) || (typeof password !== 'string') || (password.length < 1)) {
        return false;
    }

    return passwordRegex.test(password);
};

module.exports = dataValidation;