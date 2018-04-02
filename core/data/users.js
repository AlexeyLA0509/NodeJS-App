'use strict';

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const User = require('./user');
const utils = require('../utils');
const systemUtils = require('../system/utils');
const dataValidation = require('../data-validation');
//const security = require('../security');

const Users = function (db) {
    this.db = db;

    /**
    * @type {Array<User>}
    */
    this.users = new Array();

    let $isInitialized = false;

    Object.defineProperty(this, 'isInitialized', {
        get: () => {
            return $isInitialized;
        }
    });

    this.initialize = async () => {
        if ($isInitialized) {
            return;
        }

        this.users = await this.dbGetUsers();

        $isInitialized = true;
    }

};

/**
 * @returns {Array<User>}
 */
Users.prototype.dbGetUsers = function () {
    return new Promise((resolve, reject) => {
        MongoClient.connect(this.db.CONNECTION_STRING, (error, client) => {
            let items = [];

            if (error) {
                console.log(error);
                return resolve(items);
            }

            let $db = client.db(this.db.APP_1_DB);

            let c = $db.collection(this.db.APP_1_USERS_COLLECTION);
            c.find({}, { password: 0, passwordFormat: 0, passwordSalt: 0 }).toArray((error, docs) => {
                client.close();

                if (error) {
                    console.log(error);
                    return resolve(items);
                }

                for (let x = 0; x < docs.length; x++) {
                    let doc = docs[x];

                    let user = new User();
                    //user.id = doc._id.toString();
                    user.objId = doc._id;
                    user.userName = doc.userName;
                    user.email = doc.email;
                    user.createdDateTime = doc.createdDateTime;
                    user.lastLoginDateTime = doc.lastLoginDateTime;
                    user.lastActivityDateTimeid = doc.lastActivityDateTime;
                    user.currentIp = doc.currentIp;
                    user.previousIp = doc.previousIp;
                    user.displayName = doc.displayName;

                    items.push(user);
                }

                resolve(items);
            });
        });
    });
};

/**
 * @param {User} user
 * @param {String} password
 * @returns {Number} Status.
 */
Users.prototype.createUser = async function (user, password) {
    const security = require('../security');

    if (!this.isInitialized) {
        return 1;
    }

    if (systemUtils.string.isNullOrEmpty(user.userName)) {
        return 2;
    }

    if (systemUtils.string.isNullOrEmpty(user.email)) {
        return 3;
    }

    if (systemUtils.string.isNullOrEmpty(password)) {
        return 4;
    }

    user.userName = systemUtils.string.trim(user.userName, systemUtils.SEChars);

    if (!dataValidation.isUserNameValid(user.userName)) {
        return 5;
    }

    user.email = systemUtils.string.trim(user.email, systemUtils.SEChars);

    if (!dataValidation.isEmailValid(user.email)) {
        return 6;
    }

    if (!dataValidation.isPasswordValid(password) || (password.length < security.MIN_PASSWORD_LENGTH)) {
        return 7;
    }

    for (let x = 0; x < this.users.length; x++) {
        let user2 = this.users[x];

        if ((user2.userNameToLowerCase === user.userNameToLowerCase) || (user2.emailToLowerCase === user.emailToLowerCase)) {
            return 8;
        }
    }

    if (user.displayName == null) {
        user.displayName = user.userName;
    }

    let salt = security.generateSalt();
    let encodedPassword = security.encodePassword(password, security.PASSWORD_FORMAT, salt);

    user.createdDateTime = new Date();

    if (await this.dbCreateUser(user, encodedPassword, security.PASSWORD_FORMAT, salt) !== true) {
        return 9;
    }

    this.users.push(user);

    return 0;
};

/**
 * @private
 * 
 * @param {User} user
 * @param {String} encodedPassword
 * @param {Number} passwordFormat
 * @param {String} passwordSalt
 * @returns {Boolean}
 */
Users.prototype.dbCreateUser = function (user, encodedPassword, passwordFormat, passwordSalt) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(this.db.CONNECTION_STRING, (error, client) => {
            if (error) {
                console.log(error);
                return resolve(false);
            }

            let $db = client.db(this.db.APP_1_DB);
            let c = $db.collection(this.db.APP_1_USERS_COLLECTION);

            let doc = {
                userName: user.userName,
                email: user.email,
                password: encodedPassword,
                passwordFormat: passwordFormat,
                passwordSalt: passwordSalt,
                createdDateTime: user.createdDateTime,
                createdDateTimeTicks: mongodb.Long.fromNumber(user.createdDateTime.valueOf()),
                lastLoginDateTime: null,
                lastLoginDateTimeTicks: null,
                lastActivityDateTime: null,
                lastActivityDateTimeTicks: null,
                currentIp: null,
                previousIp: null,
                displayName: user.displayName
            };

            c.insertOne(doc, (error, result) => {
                client.close();

                if (error) {
                    console.log(error);
                    return resolve(false);
                }

                //user.id = result.insertedId.toString();
                user.objId = result.insertedId;

                resolve(true);
            });
        });
    });
};


/**
 * @param {String} id
 * @returns {User}
 */
Users.prototype.getUserById = function (id) {
    return utils.array.getItemById(this.users, id);
};

/**
 * @param {String} userName
 * @param {Boolean} [ignoreCase] Default: false.
 * @returns {User}
 */
Users.prototype.getUserByUserName = function (userName, ignoreCase) {
    let propertyName;

    if (ignoreCase == null) {
        ignoreCase = false;
    }

    if (ignoreCase === true) {
        propertyName = 'userNameToLowerCase';
        userName = userName.toLowerCase();
    }
    else {
        propertyName = 'userName';
    }

    return utils.array.getItemByValueOfProperty(this.users, propertyName, userName);
};

/**
 * @param {String} email
 * @param {Boolean} [ignoreCase] Default: false.
 * @returns {User}
 */
Users.prototype.getUserByEmail = function (email, ignoreCase) {
    let propertyName;

    if (ignoreCase == null) {
        ignoreCase = false;
    }

    if (ignoreCase === true) {
        propertyName = 'emailToLowerCase';
        email = email.toLowerCase();
    }
    else {
        propertyName = 'email';
    }

    return utils.array.getItemByValueOfProperty(this.users, propertyName, email);
};

module.exports = Users;
