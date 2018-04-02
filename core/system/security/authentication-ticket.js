'use strict';

class AuthenticationTicket {
    /**
     * 
     * @param {Number} version
     * @param {String} name The user name associated with authentication cookie.
     * @param {Date} issueDate The time at which the cookie was issued.
     * @param {Date} expiration The date/time at which the expires.
     * @param {Boolean} isPersistent True if a durable cookie was issued. Otherwise, the authentication cookie is scoped to the browser lifetime.
     * @param {String} userData
     * @param {String} cookiePath
     */
    constructor(version, name, issueDate, expiration, isPersistent, userData, cookiePath) {
        let $version = version;
        let $name = name;
        let $issueDate = issueDate;
        let $expiration = expiration;
        let $isPersistent = isPersistent;
        let $userData = userData;
        let $cookiePath = cookiePath;

        Object.defineProperty(this, 'version', {
            get: () => {
                return $version;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'name', {
            /**
             * The user name associated with authentication cookie.
             */
            get: () => {
                return $name;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'issueDate', {
            /**
             * The time at which the cookie was issued.
             */
            get: () => {
                return $issueDate;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'expiration', {
            /**
             * The date/time at which the expires.
             */
            get: () => {
                return $expiration;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'isPersistent', {
            /**
             * True if a durable cookie was issued. Otherwise, the authentication cookie is scoped to the browser lifetime.
             */
            get: () => {
                return $isPersistent;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'userData', {
            get: () => {
                return $userData;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'cookiePath', {
            get: () => {
                return $cookiePath;
            },
            enumerable: true
        });
    }

    /**
     * @returns {Boolean}
     */
    get expired() {
        return (this.expiration.valueOf() < Date.now());
    }
}

module.exports = AuthenticationTicket;