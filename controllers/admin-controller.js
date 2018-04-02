'use strict';

const adminControllerBase = require('./admin-controller-base');

function dashboard(request, response) {
    let context = request.httpContext;
    let viewData = adminControllerBase.initialize(context);

    if (context.isCompleteRequest === true) {
        return;
    }

    viewData.title = 'Dashboard';
    viewData.layout = 'shared/layout';

    response.render('admin/dashboard', viewData);
}

module.exports = {
    dashboard
};