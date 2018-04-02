'use strict';

const security = require('../core/security');
const auth = require('../core/system/security/authentication');

const adminControllerBase = {};

/**
 * @param {HttpContext} context
 * @returns {Object} ViewData.
 */
adminControllerBase.initialize = function (context) {
    if (!security.isCurrentUserAuthenticated(context)) {
        context.response.writeHead(302, {
            'Location': `${auth.loginUrl}?returnUrl=${encodeURIComponent(context.request.url)}`
        });

        context.response.end();
        context.isCompleteRequest = true;

        return null;
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
        src: appResoursesPaths.jsBase
    },
    {
        src: appResoursesPaths.jsAccountBase
    }];

    viewData.user = {
        name: context.user.name
    };

    return viewData;
};

module.exports = adminControllerBase;