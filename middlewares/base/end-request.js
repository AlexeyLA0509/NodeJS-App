'use strict';

/**
 * @param {Function} handler
 */
function endRequest(handler) {
    return function endRequest(request, response, next) {
        //console.log('endRequest');

        let context = request.httpContext;
        
        if (handler != null) {
            handler(context);
        }

        if (context.isCompleteRequest === true) {
            return;
        }

        response.end();
        //next();
    };
}

module.exports = endRequest;