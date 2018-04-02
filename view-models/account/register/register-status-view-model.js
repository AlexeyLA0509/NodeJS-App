'use strict';

class RegisterStatusViewModel {
    constructor() {
        this.success = false;
        this.message = null;
        /**
         * @type {LoginStatusViewModel}
         */
        this.loginStatus = null;
    }
}

module.exports = RegisterStatusViewModel;