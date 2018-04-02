'use strict';

const AuthenticationTicket = require('./authentication-ticket');

const utils = require('../utils');
const aes = require('./cryptography/aes');

const MAX_TICKET_LENGTH = 4096;
const CONFIG_DEFAULT_COOKIE = 'auth';
const PBKDF2_ITERATIONS = 2048;

const auth = {};

let initialized = false;

/**
 * @type {String}
 */
auth.cookieName = 'auth';
/**
 * @type {String}
 */
auth.loginUrl = '/account/login';
/**
 * @type {String}
 */
auth.defaultUrl = '/admin/dashboard';
/**
 * @type {String}
 * 
 * @example
 * .example.com
 */
auth.cookieDomain = undefined;
/**
 * Minutes
 * 
 * @type {Number}
 */
auth.timeout = 43200;
/**
 * @type {String}
 */
auth.cookiePath = '/';
/**
 * @type {Boolean}
 */
auth.requireSSL = false;
/**
 * @type {Boolean}
 */
auth.slidingExpiration = true;
/**
 * @type {String}
 */
auth.password = 'e4d43d5df66548a1a4355ccda6a1e58c55621c313896a896044d923268dc34f3';
/**
 * @type {String}
 */
auth.salt = '9417accf1705ad50bffbefa3a2252b06db947bccaf9d6b59d898fc735525346e';

/**
 * @type {String}
 */
auth.securityValidationKey = 'd61eaf73502283976c3ad0a3b606f02b26d4c926284ae4c63e198dea954a458f';


auth.initialize = function () {
    if (initialized) {
        return;
    }

    if (utils.string.isNullOrEmpty(this.cookieName)) {
        this.cookieName = CONFIG_DEFAULT_COOKIE;
    }

    initialized = true;
};

/**
 * Given a AuthenticationTicket, this method produces a string containing an encrypted authentication ticket suitable for use in an HTTP cookie.
 * 
 * @param {AuthenticationTicket} ticket
 * @returns {String}
 */
auth.encrypt = function (ticket) {
    if (ticket == null) {
        throw new Error('\'ticket\' parameter = null.');
    }

    this.initialize();
    /*
    let obj = {
        v: ticket.version,
        n: ticket.name,
        iD: ticket.issueDate,
        e: ticket.expiration,
        iP: ticket.isPersistent,
        uD: ticket.userData,
        cP: ticket.cookiePath
    };
    */
    let obj = {
        a: ticket.version,
        b: ticket.name,
        c: ticket.issueDate,
        d: ticket.expiration,
        e: this.securityValidationKey,
        f: ticket.isPersistent,
        g: ticket.userData,
        h: ticket.cookiePath
    };

    let data = JSON.stringify(obj);

    return aes.encrypt(data, this.password, this.salt, PBKDF2_ITERATIONS).toString('hex');
};

/**
 * Given an encrypted authenitcation ticket as obtained from an HTTP cookie, this method returns an instance of a AuthenticationTicket class.
 * 
 * @param {String} encryptedTicket
 * @returns {AuthenticationTicket}
 */
auth.decrypt = function (encryptedTicket) {
    if (utils.string.isNullOrEmpty(encryptedTicket) || (encryptedTicket.length > MAX_TICKET_LENGTH)) {
        // InvalidArgumentValue
        throw new Error('Invalid value for \'encryptedTicket\' parameter.')
    }

    this.initialize();

    let data = aes.decrypt(Buffer.from(encryptedTicket, 'hex'), this.password, this.salt, PBKDF2_ITERATIONS).toString('utf8');

    let obj = JSON.parse(data);

    //let ticket = new AuthenticationTicket(obj.v, obj.n, obj.iD, obj.e, obj.iP, obj.uD, obj.cP);

    let svk = obj['e'];

    if ((typeof svk !== 'string') || (svk.length !== this.securityValidationKey.length) || (svk !== this.securityValidationKey)) {
        return null;
    }
    
    let ticket = new AuthenticationTicket(obj.a, obj.b, new Date(obj.c), new Date(obj.d), obj.f, obj.g, obj.h);

    return ticket;
};

/**
 * 
 * @param {AuthenticationTicket} oldTicket
 * @returns {AuthenticationTicket}
 */
auth.renewTicketIfOld = function (oldTicket) {
    if (oldTicket == null) {
        return null;
    }

    let now = new Date();
    let nowValue = now.valueOf();
    let oldTicketIssueDateValue = oldTicket.issueDate.valueOf();
    let oldTicketExpirationValue = oldTicket.expiration.valueOf();
    let ticketAge = nowValue - oldTicketIssueDateValue;
    let ticketRemainingLifetime = oldTicketExpirationValue - nowValue;

    if (ticketRemainingLifetime > ticketAge) {
        return oldTicket;
    }

    let originalTicketTotalLifetime = oldTicketExpirationValue - oldTicketIssueDateValue;
    let newExpirationDT = new Date(nowValue + originalTicketTotalLifetime);

    let ticket = new AuthenticationTicket(oldTicket.version, oldTicket.name, now, newExpirationDT, oldTicket.isPersistent, oldTicket.userData, oldTicket.cookiePath);

    return ticket;
};



module.exports = auth;