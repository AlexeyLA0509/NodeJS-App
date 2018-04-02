'use strict';

const Application = require('./core/application');
const globals = require('./core/globals');

// production, development, test
process.env.NODE_ENV = 'development';

const app = new Application();
globals.app = app;

const express = require('express');

const beginRequestMiddleware = require('./middlewares/base/begin-request');
const authenticateRequestMiddleware = require('./middlewares/base/authenticate-request');
const authorizeRequestMiddleware = require('./middlewares/base/authorize-request');
//const endRequestMiddleware = require('./middlewares/base/end-request');

const errorMiddleware = (process.env.NODE_ENV === 'development') ? require('./middlewares/base/developer-error') : require('./middlewares/base/error');
const notFoundMiddleware = require('./middlewares/base/not-found');

const AuthenticationModule = require('./core/system/security/authentication-module');

const accountLoginHandler = require('./http-handlers/account-login-handler');
const accountLogoutHandler = require('./http-handlers/account-logout-handler');
const accountRegisterHandler = require('./http-handlers/account-register-handler');

const accountController = require('./controllers/account-controller');
const baseController = require('./controllers/base-controller');
const adminController = require('./controllers/admin-controller');

const security = require('./core/security');

const compression = require('compression');
//const cookieSession = require('cookie-session');
const bodyParser = require('./node_modules/body-parser');
const hbs = require('hbs');
const fs = require('fs');

function configure() {
    let $root = app.$root;

    hbs.registerPartials(__dirname + '/views/shared/partials');
    hbs.registerPartial('loginPartial', fs.readFileSync(__dirname + '/views/shared/partials/login-partial.hbs', 'utf8'));
    hbs.registerPartial('footerNavUserMenuPartial', fs.readFileSync(__dirname + '/views/shared/partials/footer-nav-user-menu-partial.hbs', 'utf8'));

    $root.set('view engine', 'hbs');


    $root.use(beginRequestMiddleware(onBeginRequest));

    let authModule = new AuthenticationModule(authenticationModule_OnAuthenticate);

    $root.use(authenticateRequestMiddleware(authModule, onAuthenticateRequest));

    $root.use(authorizeRequestMiddleware(onAuthorizeRequest));

    $root.use(compression());
    /*
    $root.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2'],
        maxAge: 24 * 60 * 60 * 1000
    }));
    */
    $root.use(bodyParser.json());
    /*
    $root.use(bodyParser.urlencoded({
        extended: false
    }));
    */
    $root.use('/static', express.static(__dirname + '/static'));

    if (app.appRelease === false) {
        $root.use('/dev/static', express.static(__dirname + '/dev/static'));
    }

    registerRoutes();

    $root.use(notFoundMiddleware());
    $root.use(errorMiddleware());
}

function registerRoutes() {
    let $root = app.$root;

    $root.post('/account/login', accountLoginHandler);
    $root.post('/account/logout', accountLogoutHandler);
    $root.post('/account/register', accountRegisterHandler);

    $root.get('/', baseController.index);
    $root.get('/about', baseController.about);
    $root.get('/contacts', baseController.contacts);
    $root.get('/admin/dashboard', adminController.dashboard);

    $root.get('/account/login', accountController.login);
    $root.get('/account/register', accountController.register);

}

/***************************************************************
 * <App Request Handlers>
***************************************************************/

/**
 * @param {HttpContext} context
 */
function onBeginRequest(context) {
    // 1
    //console.log('onBeginRequest');


}
/**
 * @param {HttpContext} context
 */
function authenticationModule_OnAuthenticate(context) {
    // 2
    //console.log('authenticationModule_OnAuthenticate');
}

/**
 * @param {HttpContext} context
 */
function onAuthenticateRequest(context) {
    // 3
    //console.log('onAuthenticateRequest');
}

/**
 * @param {HttpContext} context
 */
function onAuthorizeRequest(context) {
    // 4
    //console.log('onAuthorizeRequest');
}

/**
 * @param {HttpContext} context
 */
/*
function onEndRequest(context) {
    console.log('onEndRequest');
}
*/
/***************************************************************
 * </App Request Handlers>
***************************************************************/

/**
 * Startup
 */
(function () {
    app.appStart();

    configure();

    app.$root.listen(5000);
})();