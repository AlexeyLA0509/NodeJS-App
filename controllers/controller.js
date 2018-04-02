'use strict';

const security = require('../core/security');

const controller = {};

/**
 * @param {HttpContext} context
 * @returns {Object} ViewData.
 */
controller.initialize = function (context) {
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
    }];

    if (security.isCurrentUserAuthenticated(context)) {
        viewData.scripts.push({
            src: appResoursesPaths.jsAccountBase
        });

        viewData.user = {
            name: context.user.name
        };
    }

    return viewData;
};

module.exports = controller;