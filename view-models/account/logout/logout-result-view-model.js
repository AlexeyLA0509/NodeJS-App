'use strict';

const ViewModelBase = require('../../view-model-base');

class LogoutResultViewModel extends ViewModelBase {
    constructor() {
        super();

        this.targetUrl = null;
    }
}

module.exports = LogoutResultViewModel;