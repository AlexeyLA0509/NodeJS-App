'use strict';

const http = require('http');

function error() {
    return function error(error, request, response, next) {
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

module.exports = error;
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
        error: null
    });
}

module.exports = {
    invoke
};
*/