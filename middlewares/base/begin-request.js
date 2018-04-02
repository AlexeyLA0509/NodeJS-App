'use strict';

const globals = require('../../core/globals');
const app = globals.app;
const HttpContext = require('../../core/system/http/http-context');
/*
function invoke(request, response, next) {
    let context = new HttpContext(request, response);

    request.httpContext = context;

    next();

    console.log('RequestMiddleware, response.statusCode: ' + response.statusCode);
}

module.exports = {
    invoke
};
*/

/**
 * @param {Function} handler
 */
function beginRequest(handler) {
    return function beginRequest(request, response, next) {
        //console.log('beginRequest');

        let context = new HttpContext(app, request, response);

        //request.httpContext = context;
        //response.httpContext = context;

        if (handler != null) {
            handler(context);
        }

        if (context.isCompleteRequest === true) {
            return;
        }

        next();

        //console.log('beginRequest, response.statusCode: ' + response.statusCode);
    };
}

module.exports = beginRequest;