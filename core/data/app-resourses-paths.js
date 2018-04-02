'use strict';

class AppResoursesPaths {
    /**
     * @param {Boolean} appRelease 
     */
    constructor(appRelease) {
        if (appRelease) {
            this.jsCore = '/static/js/core.min.js';
            this.jsBase = '/static/js/base.min.js';
            this.jsAccountBase = '/static/js/account/account-base.min.js';
            this.jsAccountLogin = '/static/js/account/login.min.js';
            this.jsAccountRegister = '/static/js/account/register.min.js';

            this.cssBase = '/static/css/base.min.css';
        }
        else {
            this.jsCore = '/dev/static/js/core.js';
            this.jsBase = '/dev/static/js/base.js';
            this.jsAccountBase = '/dev/static/js/account/account-base.js';
            this.jsAccountLogin = '/dev/static/js/account/login.js';
            this.jsAccountRegister = '/dev/static/js/account/register.js';

            this.cssBase = '/dev/static/css/base.css';
        }
    }
}

module.exports = AppResoursesPaths;