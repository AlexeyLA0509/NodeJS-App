'use strict';

const UserIdentity = require('../../core/system/security/identity/user-identity');

/**
 * @param {AuthenticationModule} authModule
 * @param {Function} handler
 */
function authenticateRequest(authModule, handler) {
    return function authenticateRequest(request, response, next) {
        //console.log('authenticateRequest');

        let context = request.httpContext;

        if (authModule != null) {
            authModule.invoke(context);
        }

        if (handler != null) {
            handler(context);
        }

        if (context.isCompleteRequest === true) {
            return;
        }

        if (context.user == null) {
            context.user = new UserIdentity(null, null, null, false);
        }

        next();
    };
}

module.exports = authenticateRequest;