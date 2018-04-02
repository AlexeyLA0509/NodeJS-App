'use strict';

const ViewModelBase = require('../view-models/view-model-base');
const LogoutResultViewModel = require('../view-models/account/logout/logout-result-view-model');
const security = require('../core/security');
const auth = require('../core/system/security/authentication');

function invoke(request, response) {
    let context = request.httpContext;

    let empty = true;
    let sendData = null;
    let sendDataObj = null;
    let status = 0;
    let errorCode = -1;

    label_I_1: {
        if (!security.isCurrentUserAuthenticated(context)) {
            errorCode = 100;
            break label_I_1;
        }

        security.logout(context);
        /*
        let lrvm = new LogoutResultViewModel();
        lrvm.targetUrl = auth.loginUrl;
        lrvm.status = 1;
        lrvm.errorCode = -1;
        */
        let vmb = new ViewModelBase();
        vmb.status = 1;
        vmb.errorCode = -1;

        empty = false;
        sendDataObj = vmb;
    }

    if ((sendDataObj == null) || (empty === true)) {
        if (errorCode === -1) {
            errorCode = 110;
        }

        sendDataObj = new ViewModelBase();
        sendDataObj.status = status;
        sendDataObj.errorCode = errorCode;
    }

    try {
        sendData = JSON.stringify(sendDataObj);
    }
    catch (e) {
        sendData = 'Error';
    }

    response.end(sendData);
}

module.exports = invoke;