'use strict';

const globals = require('../core/globals');
const controller = require('./controller');

const db = globals.app.db;

function index(request, response) {
    let viewData = controller.initialize(request.httpContext);

    viewData.title = 'Home';
    viewData.layout = 'shared/layout';

    response.render('base/index', viewData);
}

function about(request, response) {
    let viewData = controller.initialize(request.httpContext);

    viewData.title = 'About Us';
    viewData.layout = 'shared/layout';

    response.render('base/about', viewData);
}

function contacts(request, response) {
    let viewData = controller.initialize(request.httpContext);

    viewData.title = 'Contacts';
    viewData.layout = 'shared/layout';

    response.render('base/contacts', viewData);
}

module.exports = {
    index,
    about,
    contacts
};