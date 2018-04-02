'use strict';

const http = require('http');

function developerError() {
    return function developerError(error, request, response, next) {
        let status = error.status || error.statusCode || 500;
        let description = http.STATUS_CODES[status];

        response.status(status);

        response.render('error', {
            title: status,
            content: {
                title: `${status} ${description}`,
            },
            error: error
        });
    };
}

module.exports = developerError;
/*
function invoke(error, request, response, next) {
    let status = error.status || error.statusCode || 500;
    let description = http.STATUS_CODES[status];

    response.status(status);

    response.render('error', {
        title: status,
        content: {
            title: `${status} ${description}`,
        },
        error: error
    });
}

module.exports = {
    invoke
};
*/