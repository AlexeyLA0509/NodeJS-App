'use strict';

const ViewModelBase = require('../view-models/view-model-base');
const LoginStatusResultViewModel = require('../view-models/account/login/login-status-result-view-model');
const security = require('../core/security');
const systemUtils = require('../core/system/utils');
const auth = require('../core/system/security/authentication');

async function invoke(request, response) {
    let context = request.httpContext;

    let empty = true;
    let sendData = null;
    let sendDataObj = null;
    let status = 0;
    let errorCode = -1;

    label_I_1: {
        if (security.isCurrentUserAuthenticated(context)) {
            errorCode = 100;
            break label_I_1;
        }

        let data = request.body;

        if (data == null) {
            errorCode = 101;
            break label_I_1;
        }

        if (data.type === 0) {
            // Authenticate
            empty = false;
            sendDataObj = await dataAuthenticate(context, data);
        }
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

/**
 * @param {HttpContext} context
 * @param {Object} data
 * @returns {LoginStatusResultViewModel}
 */
async function dataAuthenticate(context, data) {
    let lsrvm = new LoginStatusResultViewModel();
    let status = 0;
    let errorCode = -1;

    /**
     * @type {{email:String, password:String, rememberMe:Boolean}}
     */
    let da = data.data;

    label_DA_1: {
        if (da == null) {
            errorCode = 1000;
            break label_DA_1;
        }

        if (systemUtils.string.isNullOrWhiteSpace(da.email)) {
            errorCode = 1001;
            break label_DA_1;
        }

        if (systemUtils.string.isNullOrWhiteSpace(da.password)) {
            errorCode = 1002;
            break label_DA_1;
        }

        let rememberMe = (typeof da.rememberMe === 'boolean') ? da.rememberMe : false;

        let status2 = 1003;

        try {
            status2 = await security.authenticateUserByEmail(context, da.email, da.password, rememberMe);
        }
        catch (e) {
            errorCode = 1003;
            break label_DA_1;
        }
        
        if (status2 === 0) {
            lsrvm.success = true;
            lsrvm.message = 'Successful.';

            let returnUrl = context.request.query['returnUrl'];
            // && (returnUrl[0] === '/')
            lsrvm.targetUrl = (!systemUtils.string.isNullOrWhiteSpace(returnUrl)) ? returnUrl : auth.defaultUrl;
        }
        else {
            lsrvm.success = false;
            lsrvm.message = 'Incorrect email or password.';
            lsrvm.targetUrl = auth.loginUrl;
        }

        status = 1;
    }

    lsrvm.status = status;
    lsrvm.errorCode = errorCode;

    return lsrvm;
}

module.exports = invoke;