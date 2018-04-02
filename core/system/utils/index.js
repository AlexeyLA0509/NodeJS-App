'use strict';

const arrayUtils = require('./internal/array-utils');
const stringUtils = require('./internal/string-utils');

/**
* Start End Chars
*/
const SEChars = [' ', '\n', '\r', '\t'];

/**
 * 
 * @param {Object} obj Object on which modify the property.
 * @param {String} propertyName The property name.
 */
function defineReadOnly(obj, propertyName) {
    Object.defineProperty(obj, propertyName, {
        enumerable: true,
        writable: false
    });
};

/**
 * 
 * @param {Object} obj Object on which to add or modify the property.
 * @param {String} propertyName The property name.
 * @param {Function} getter 
 */
function defineGetter(obj, propertyName, getter) {
    Object.defineProperty(obj, propertyName, {
        get: getter,
        enumerable: true
    });
};

/**
* Has Start End Chars
*
* @param {Char} ch
* @returns {Boolean}
*/
function hasSEChars(ch) {
    return ((ch === ' ') || (ch === '\n') || (ch === '\r') || (ch === '\t'));
};







const utils = {
    defineReadOnly,
    defineGetter,
    SEChars,
    hasSEChars,
    array: arrayUtils,
    string: stringUtils
};

module.exports = utils;