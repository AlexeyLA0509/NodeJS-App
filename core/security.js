'use strict';

const crypto = require('crypto');
const Cookie = require('../node_modules/cookies').Cookie;

const MongoClient = require('mongodb').MongoClient;

const auth = require('./system/security/authentication');
const AuthenticationTicket = require('./system/security/authentication-ticket');
const dataValidation = require('./data-validation');
const systemUtils = require('./system/utils');
const UserIdentity = require('./system/security/identity/user-identity');

const globals = require('./globals');
const db = globals.app.db;

const SALT_SIZE = 16;
const GENERATE_PASSWORD_SIZE = 10;
const MIN_PASSWORD_LENGTH = 10;
const PASSWORD_FORMAT = 1;

const security = {};

security.MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH;
security.PASSWORD_FORMAT = PASSWORD_FORMAT;

//security.securityValidationKey = 'd61eaf73502283976c3ad0a3b606f02b26d4c926284ae4c63e198dea954a458f';

/**
 * @param {HttpContext} context
 * @returns {Boolean}
 */
security.isCurrentUserAuthenticated = function (context) {
    return ((context.user != null) && (context.user.isAuthenticated === true));
};

/**
 * @param {HttpContext} context
 * @returns {User}
 */
security.currentUser = function (context) {
    if (!this.isCurrentUserAuthenticated(context)) {
        return null;
    }

    return db.users.getUserByUserName(context.user.name, false);
};

/**
 * @param {HttpContext} context
 * @param {String} userName
 * @param {String} password
 * @param {Boolean} rememberMe
 * @returns {Number} Status.
 */
security.authenticateUserByUserName = async function (context, userName, password, rememberMe) {
    if (context == null) {
        return 2;
    }

    if (!context.application.appStarted || context.application.appExiting) {
        return 3;
    }

    if (!dataValidation.isUserNameValid(userName) || !dataValidation.isPasswordValid(password)) {
        return 4;
    }

    let user = db.users.getUserByUserName(userName, false);

    if (user == null) {
        return 5;
    }


    return await this.authenticateUser(context, user, password, rememberMe);
};

/**
 * @param {HttpContext} context
 * @param {String} email
 * @param {String} password
 * @param {Boolean} rememberMe
 * @returns {Number} Status.
 */
security.authenticateUserByEmail = async function (context, email, password, rememberMe) {
    if (context == null) {
        return 2;
    }

    if (!context.application.appStarted || context.application.appExiting) {
        return 3;
    }

    if (!dataValidation.isEmailValid(email) || !dataValidation.isPasswordValid(password)) {
        return 4;
    }

    let user = db.users.getUserByEmail(email, false);

    if (user == null) {
        return 5;
    }


    return await this.authenticateUser(context, user, password, rememberMe);
};

/**
 * @param {HttpContext} context
 * @param {User} user
 * @param {String} password
 * @param {Boolean} rememberMe
 * @returns {Number} Status.
 */
security.authenticateUser = async function (context, user, password, rememberMe) {
    if ((context.user != null) && (context.user.isAuthenticated === true)) {
        return 10;
    }

    if (await this.validateUser(user, password) === true) {
        let currentTime = new Date();
        let expirationDT = new Date(currentTime);
        expirationDT.setMinutes(expirationDT.getMinutes() + auth.timeout);
        let ticket = new AuthenticationTicket(1, user.userName, currentTime, expirationDT, rememberMe, null, auth.cookiePath);

        let cookieValue = null;

        try {
            cookieValue = auth.encrypt(ticket);
        }
        catch (e) {

        }

        if (systemUtils.string.isNullOrEmpty(cookieValue)) {
            return 15;
        }

        /*
        let cookie = new Cookie(auth.cookieName, cookieValue, {
            domain: auth.cookieDomain,
            httpOnly: true,
            path: auth.cookiePath,
            secure: auth.requireSSL
        });

        if (rememberMe === true) {
            cookie.expires = expirationDT;
        }
        */

        let cookieParams = {
            domain: auth.cookieDomain,
            httpOnly: true,
            path: auth.cookiePath,
            secure: auth.requireSSL
        };

        if (rememberMe === true) {
            cookieParams.expires = expirationDT;
        }

        context.cookies.set(auth.cookieName, cookieValue, cookieParams);

        user.lastLoginDateTime = currentTime;
        user.lastActivityDateTime = currentTime;
        user.previousIp = user.currentIp;
        user.currentIp = context.connection.remoteIpAddress

        //context.user = new UserIdentity(user.userName, user, null, true);

        //db.users.dbUpdateLastLogin(user);

        return 0;
    }
    else {

    }

    return 1;
};

/**
 * @param {HttpContext} context
 */
security.logout = function (context) {
    if ((context.user == null) || (context.user.isAuthenticated === false)) {
        return;
    }

    let cookieValue = 'NoCookie';
    let expirationDT = new Date();
    expirationDT.setDate(expirationDT.getDate() - 1);

    let cookieParams = {
        expires: expirationDT,
        domain: auth.cookieDomain,
        httpOnly: true,
        path: auth.cookiePath,
        secure: auth.requireSSL
    };

    // Remove cookie from Request.Cookies.

    context.cookies.set(auth.cookieName, cookieValue, cookieParams);

    let user = context.user.target || db.users.getUserByUserName(context.user.name, false);

    if (user == null) {
        return;
    }

    user.lastActivityDateTime = new Date();

    //context.user = new UserIdentity(null, null, null, false);

    // db.users.dbUpdateLastActivity
}







/**
 * @param {User} user
 * @param {String} password
 * @returns {Boolean}
 */
security.validateUser = async function (user, password) {
    if ((user == null) || systemUtils.string.isNullOrEmpty(password)) {
        return false;
    }

    return await checkPassword(user, password);
};

/**
 * 
 * @param {User} user
 * @param {String} password
 * @returns {Boolean}
 */
async function checkPassword(user, password) {
    let passwordFromDb = null;
    let passwordSalt = null;

    let data = null;

    try {
        data = await getPasswordWithFormatAsync(user);
    }
    catch (e) {

    }

    if (data == null) {
        return false;
    }

    let encodedPassword = security.encodePassword(password, data.passwordFormat, data.passwordSalt);

    let isPasswordCorrect = (encodedPassword === data.password);

    return isPasswordCorrect;
}

/**
 * @param {User} user
 * @returns {{password:String, passwordFormat:Number, passwordSalt:String}}
 */
function getPasswordWithFormatAsync(user) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(db.CONNECTION_STRING, (error, client) => {
            if (error) {
                console.log(error);
                return resolve(null);
            }

            let $db = client.db(db.APP_1_DB);
            let c = $db.collection(db.APP_1_USERS_COLLECTION);
            c.findOne({ _id: user.objId }, { password: 1, passwordFormat: 1, passwordSalt: 1 }, (error, result) => {
                client.close();

                if (error) {
                    console.log(error);
                    return resolve(null);
                }

                resolve(result);
            });
        });
    });
}

/**
 * 
 * @param {String} password
 * @param {Number} passwordFormat
 * @param {String} salt
 * @returns {String} Encoded password.
 */
security.encodePassword = function (password, passwordFormat, salt) {
    if (passwordFormat === 0) {
        return password;
    }

    let encodedPasswordBuf;
    let hash;
    let passwordBuf;
    let saltBuf = Buffer.from(salt, 'base64');

    if (passwordFormat === 1) {
        hash = crypto.createHash('sha512');
        hash.update(password, 'utf8');
        passwordBuf = hash.digest();
        encodedPasswordBuf = crypto.pbkdf2Sync(passwordBuf, saltBuf, 1024, 32, 'sha512');
    }
    else {
        passwordBuf = Buffer.from(password, 'utf8');
        encodedPasswordBuf = Buffer.concat([passwordBuf, saltBuf], passwordBuf.length + saltBuf.length);
    }

    hash = crypto.createHash('sha512');
    hash.update(encodedPasswordBuf, 'utf8');

    return hash.digest('base64');
};

/**
 * @returns {String}
 */
security.generateSalt = function () {
    let buf = crypto.randomBytes(SALT_SIZE);

    return buf.toString('base64');
};

/**
 * @returns {String}
 */
security.generatePassword = function () {
    let buf = crypto.randomBytes(GENERATE_PASSWORD_SIZE);

    return buf.toString('base64');
};

module.exports = security;