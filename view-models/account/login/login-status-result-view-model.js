'use strict';

const ViewModelBase = require('../../view-model-base');

class LoginStatusResultViewModel extends ViewModelBase {
    constructor() {
        super();

        this.success = false;
        this.message = null;
        this.targetUrl = null;
    }
}

module.exports = LoginStatusResultViewModel;