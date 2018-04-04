'use strict';

const express = require('express');
//const connect = require('connect');
const systemUtils = require('./system/utils');
const Db = require('./database/database-managment-system');
const AppResoursesPaths = require('./data/app-resourses-paths');

const Application = function () {
    let $appStarted = false;
    let $appExiting = false;
    let $appRelease = false;
    let $appResoursesPaths = new AppResoursesPaths($appRelease);

    let $db = new Db(this);

    let _$root = express();
    //let _$root = connect();

    systemUtils.defineGetter(this, 'appStarted', () => {
        return $appStarted;
    });

    systemUtils.defineGetter(this, 'appExiting', () => {
        return $appExiting;
    });

    systemUtils.defineGetter(this, 'appRelease', () => {
        return $appRelease;
    });

    systemUtils.defineGetter(this, 'appResoursesPaths', () => {
        return $appResoursesPaths;
    });

    systemUtils.defineGetter(this, 'db', () => {
        return $db;
    });

    systemUtils.defineGetter(this, '$root', () => {
        return _$root;
    });

    this.appStart = async () => {
        if ($appStarted) {
            return false;
        }

        await $db.initialize();

        $appStarted = true;

        return true;
    };

};

module.exports = Application;