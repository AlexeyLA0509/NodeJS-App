'use string';

const Cookies = require('../../../node_modules/cookies');

const ConnectionInfo = require('./connection-info');

/**
 * Encapsulates all HTTP-specific information about an individual HTTP request.
 */
class HttpContext {
    /**
     * @param {Application} app
     * @param {IncomingMessage} request 
     * @param {ServerResponse} response 
     */
    constructor(app, request, response) {
        request.httpContext = this;
        response.httpContext = this;

        let $app = app;
        let $request = request;
        let $response = response;
        let $cookies = null;
        let $connection = null;

        Object.defineProperty(this, 'application', {
            get: () => {
                return $app;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'request', {
            /**
             * Gets the IncomingMessage object for the current HTTP request.
             */
            get: () => {
                return $request;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'response', {
            /**
             * Gets the ServerResponse object for the current HTTP request.
             */
            get: () => {
                return $response;
            },
            enumerable: true
        });

        /**
         * @type {UserIdentity}
         */
        this.user = null;

        Object.defineProperty(this, 'cookies', {
            get: () => {
                return $cookies;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'connection', {
            /**
             * Gets information about the underlying connection for this request.
             */
            get: () => {
                return $connection;
            },
            enumerable: true
        });

        this.isCompleteRequest = false;


        $cookies = new Cookies(request, response);
        $connection = new ConnectionInfo(this);
    }
}

module.exports = HttpContext;