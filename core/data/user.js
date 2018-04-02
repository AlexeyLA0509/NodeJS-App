'use strict';

const ObjectID = require('mongodb').ObjectID;

const systemUtils = require('../system/utils');

class User {
    constructor() {
        /**
         * @type {String}
         */
        let $id = null;
        /**
         * @type {ObjectID}
         */
        let $objId = null;
        /**
         * @type {String}
         */
        let $userName = null;
        let $userNameToLowerCase = null;
        let $email = null;
        let $emailToLowerCase = null;

        Object.defineProperty(this, 'id', {
            get: () => {
                return $id;
            },
            set: (value) => {
                $id = value;

                $objId = (value != null) ? new ObjectID(value) : null;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'objId', {
            get: () => {
                return $objId;
            },
            set: (value) => {
                $objId = value;

                $id = (value != null) ? value.toString() : null;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'userName', {
            get: () => {
                return $userName;
            },
            set: (value) => {
                $userName = value;

                $userNameToLowerCase = (value != null) ? value.toLowerCase() : null;
            },
            enumerable: true
        });

        systemUtils.defineGetter(this, 'userNameToLowerCase', () => {
            return $userNameToLowerCase;
        });

        Object.defineProperty(this, 'email', {
            get: () => {
                return $email;
            },
            set: (value) => {
                $email = value;

                $emailToLowerCase = (value != null) ? value.toLowerCase() : null;
            },
            enumerable: true
        });

        systemUtils.defineGetter(this, 'emailToLowerCase', () => {
            return $emailToLowerCase;
        });

        /**
         * @type {Date}
         */
        this.createdDateTime = null;
        /**
         * @type {Date}
         */
        this.lastLoginDateTime = null;
        /**
         * @type {Date}
         */
        this.lastActivityDateTime = null;
        /**
         * @type {String}
         */
        this.currentIp = null;
        /**
         * @type {String}
         */
        this.previousIp = null;
        /**
         * @type {String}
         */
        this.displayName = null;

    }
}

module.exports = User;