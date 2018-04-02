'use strict';

/**
 * @param {Function} handler
 */
function authorizeRequest(handler) {
    return function authorizeRequest(request, response, next) {
        //console.log('authorizeRequest');

        let context = request.httpContext;
        
        if (handler != null) {
            handler(context);
        }

        if (context.isCompleteRequest === true) {
            return;
        }

        next();
    };
}

module.exports = authorizeRequest;