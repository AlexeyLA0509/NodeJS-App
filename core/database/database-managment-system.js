'use strict';

const systemUtils = require('../system/utils');
const Users = require('../data/users');

/**
 * 
 * @param {Application} app
 */
const DatabaseManagmentSystem = function (app) {
    let $app = app;

    this.CONNECTION_STRING = 'mongodb://localhost:27017';
    this.APP_1_DB = 'app_1';
    this.APP_1_USERS_COLLECTION = 'users'

    let $users = new Users(this);
    let $isInitialized = false;

    systemUtils.defineGetter(this, 'app', () => {
        return $app;
    });

    systemUtils.defineGetter(this, 'users', () => {
        return $users;
    });

    systemUtils.defineGetter(this, 'isInitialized', () => {
        return $isInitialized;
    });

    this.initialize = async () => {
        if ($isInitialized) {
            return;
        }

        await $users.initialize();

        $isInitialized = true;
    };

};

module.exports = DatabaseManagmentSystem;