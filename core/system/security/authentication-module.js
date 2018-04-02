'use strict';

const UserIdentity = require('./identity/user-identity');
const AuthenticationTicket = require('./authentication-ticket');
const auth = require('./authentication');
const utils = require('../utils');

/**
 * @param {Function} handler
 */
const AuthenticationModule = function (handler) {
    let eventHandler = handler;

    /**
     * 
     * @param {HttpContext} context
     */
    this.invoke = function (context) {
        //console.log('AuthenticationModule');

        if (eventHandler != null) {
            eventHandler(context);
        }

        if (context.user != null) {
            return;
        }

        let ticket = extractTicketFromCookie(context, auth.cookieName);

        if ((ticket == null) || utils.string.isNullOrEmpty(ticket.name) || ticket.expired) {
            return;
        }

        let ticket2 = ticket;

        if (auth.slidingExpiration) {
            ticket2 = auth.renewTicketIfOld(ticket);
        }

        context.user = new UserIdentity(ticket2.name, ticket2, null, true);

        if (ticket2 === ticket) {
            return;
        }

        let cookieValue = null;

        try {
            cookieValue = auth.encrypt(ticket2);
        }
        catch (e) {

        }

        if (utils.string.isNullOrEmpty(cookieValue)) {
            return;
        }

        let cookieParams = {
            domain: auth.cookieDomain,
            httpOnly: true,
            path: ticket2.cookiePath,
            secure: auth.requireSSL
        };

        if (ticket2.isPersistent === true) {
            cookieParams.expires = ticket2.expiration;
        }

        // Remove cookie from Request.Cookies.

        context.cookies.set(auth.cookieName, cookieValue, cookieParams);
    };

    /**
     * 
     * @param {HttpContext} context
     * @param {String} cookieName
     * @returns {AuthenticationTicket}
     */
    function extractTicketFromCookie(context, cookieName) {
        let ticket = null;
        let cookieValue = context.cookies.get(cookieName);

        if (utils.string.isNullOrEmpty(cookieValue)) {
            return null;
        }

        try {
            ticket = auth.decrypt(cookieValue);
        }
        catch (e) {

        }

        if ((ticket == null) || ticket.expired) {
            // Remove cookie from Request.Cookies.

            return null;
        }

        return ticket;
    }

    (function () {
        auth.initialize();
    });
};

module.exports = AuthenticationModule;