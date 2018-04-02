'use strict';

class ConnectionInfo {
    /**
     * 
     * @param {HttpContext} context 
     */
    constructor(context) {
        let $httpContext = context;

        let socket = context.request.socket;

        /*
        * Forwarded HTTP Extension: https://tools.ietf.org/html/rfc7239
        * x-forwarded-for
        */
        /**
         * Gets the IP address of the remote client.
         * 
         * @type {String}
         */
        this.remoteIpAddress = socket.remoteAddress;
        /**
         * Gets the remote IP family. 'IPv4' or 'IPv6'.
         * 
         * @type {String}
         */
        this.remoteIPFamily = socket.remoteFamily;
        /**
         * Gets the port of the remote client.
         * 
         * @type {Number?}
         */
        this.remotePort = socket.remotePort;
        /**
         * Gets the local IP address the remote client is connecting on.
         * 
         * @type {String}
         */
        this.localIpAddress = socket.localAddress;
        /**
         * Gets the local port.
         * 
         * @type {Number?}
         */
        this.localPort = socket.localPort;
    }
}

module.exports = ConnectionInfo;