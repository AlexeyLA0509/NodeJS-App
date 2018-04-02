'use strict';

function notFound() {
    return function notFound(request, response, next) {
        response.status(404);
        response.render('error', {
            title: 404,
            content: {
                title: '404 Not Found',
            },
            error: null
        });
    };
}

module.exports = notFound;

/*
function invoke(request, response, next) {
    response.status(404);
    response.render('error', {
        title: 404,
        content: {
            title: '404 Not Found',
        },
        error: null
    });

    /*
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
    
}

module.exports = {
    invoke
};
*/