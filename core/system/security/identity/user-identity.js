'use strict';

class UserIdentity {
    /**
     * 
     * @param {String} name Name of the current user.
     * @param {AuthenticationTicket} ticket
     * @param {Object} target Current user.
     * @param {Boolean} isAuthenticated
     */
    constructor(name, ticket, target, isAuthenticated) {
        let $name = name;
        let $ticket = ticket;
        let $target = target;
        let $isAuthenticated = isAuthenticated;

        Object.defineProperty(this, 'name', {
            /**
             * Gets the name of the current user.
             */
            get: () => {
                return $name;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'ticket', {
            get: () => {
                return $ticket;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'target', {
            /**
             * Gets the current user.
             */
            get: () => {
                return $target;
            },
            enumerable: true
        });

        Object.defineProperty(this, 'isAuthenticated', {
            /**
             * Gets a value that indicates whether the user has been authenticated.
             */
            get: () => {
                return $isAuthenticated;
            },
            enumerable: true
        });
    }
}

module.exports = UserIdentity;