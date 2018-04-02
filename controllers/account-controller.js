'use strict';

const globals = require('../core/globals');
const security = require('../core/security');
const auth = require('../core/system/security/authentication');

const db = globals.app.db;

function login(request, response) {
    let context = request.httpContext;

    if (security.isCurrentUserAuthenticated(context)) {
        response.writeHead(302, {
            'Location': auth.defaultUrl
        });

        response.end();
        return;
    }

    let appResoursesPaths = context.application.appResoursesPaths;

    let viewData = {};

    viewData.styles = [{
        href: appResoursesPaths.cssBase
    }];

    viewData.scripts = [{
        src: appResoursesPaths.jsCore
    },
    {
        src: appResoursesPaths.jsAccountLogin
    }];

    response.render('account/login', viewData);
}

function register(request, response) {
    let context = request.httpContext;

    if (security.isCurrentUserAuthenticated(context)) {
        response.writeHead(302, {
            'Location': auth.defaultUrl
        });

        response.end();
        return;
    }

    let appResoursesPaths = context.application.appResoursesPaths;

    let viewData = {};

    viewData.title = 'Register';
    viewData.layout = 'shared/layout';

    viewData.styles = [{
        href: appResoursesPaths.cssBase
    }];

    viewData.scripts = [{
        src: appResoursesPaths.jsCore
    },
    {
        src: appResoursesPaths.jsAccountRegister
    }];

    response.render('account/register', viewData);
}

module.exports = {
    login,
    register
};