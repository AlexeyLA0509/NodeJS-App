'use strict';

const ViewModelBase = require('../view-models/view-model-base');
const RegisterStatusResultViewModel = require('../view-models/account/register/register-status-result-view-model');
const LoginStatusViewModel = require('../view-models/account/login/login-status-view-model');
const User = require('../core/data/user');

const security = require('../core/security');
const systemUtils = require('../core/system/utils');
const auth = require('../core/system/security/authentication');
const dataValidation = require('../core/data-validation');

const globals = require('../core/globals');
const db = globals.app.db;


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
            // Register
            empty = false;
            sendDataObj = await dataRegister(context, data);
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
 * @returns {RegisterStatusResultViewModel}
 */
async function dataRegister(context, data) {
    let rsrvm = new RegisterStatusResultViewModel();
    let status = 0;
    let errorCode = -1;

    /**
     * @type {{userName:String, email:String, password:String}}
     */
    let dr = data.data;

    label_DR_1: {
        if (dr == null) {
            errorCode = 1000;
            break label_DR_1;
        }

        if (systemUtils.string.isNullOrWhiteSpace(dr.userName)) {
            errorCode = 1001;
            break label_DR_1;
        }
        
        if (systemUtils.string.isNullOrWhiteSpace(dr.email)) {
            errorCode = 1002;
            break label_DR_1;
        }

        if (systemUtils.string.isNullOrWhiteSpace(dr.password)) {
            errorCode = 1003;
            break label_DR_1;
        }

        let user = new User();
        user.userName = dr.userName;
        user.email = dr.email;

        let status2 = 1004;

        try {
            status2 = await db.users.createUser(user, dr.password);
        }
        catch (e) {
            errorCode = 1004;
            break label_DR_1;
        }
        
        if (status2 === 0) {
            rsrvm.success = true;
            rsrvm.message = 'Successful.';

            let lsvm = new LoginStatusViewModel();
            let status3 = 1010;

            try {
                status3 = await security.authenticateUserByEmail(context, user.email, dr.password, false);
            }
            catch (e) {
                status3 = 1010;
            }

            if (status3 === 0) {
                lsvm.success = true;
                lsvm.message = 'Successful.';
                lsvm.targetUrl = auth.defaultUrl;
            }
            else {
                lsvm.success = false;
                lsvm.message = 'Incorrect email or password.';
                lsvm.targetUrl = auth.loginUrl;
            }

            rsrvm.loginStatus = lsvm;
        }
        else {
            rsrvm.success = false;
            rsrvm.message = `Error: ${status2}`;
        }

        status = 1;
    }

    rsrvm.status = status;
    rsrvm.errorCode = errorCode;

    return rsrvm;
}

module.exports = invoke;