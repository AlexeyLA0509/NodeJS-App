'use strict';

const ViewModelBase = require('../../view-model-base');

class RegisterStatusResultViewModel extends ViewModelBase {
    constructor() {
        super();

        this.success = false;
        this.message = null;
        /**
         * @type {LoginStatusViewModel}
         */
        this.loginStatus = null;
    }
}

module.exports = RegisterStatusResultViewModel;