'use strict';

const stringUtils = {};

/**
* @param {String} value
* @param {Array<Char>|Array<String>} trimChars
* @param {Number} [type] Type: 0 - start, 1 - end, 2 - both
* @returns {String}
*/
stringUtils.trim = function (value, trimChars, type) {
    var start = 0;
    var end = value.length - 1;
    var x;

    if (type == null) {
        type = 2;
    }

    if (type !== 1) {
        for (; start < value.length; start++) {
            var charValue = value[start];
            x = 0;

            for (; x < trimChars.length; x++) {
                if (trimChars[x] === charValue) {
                    break;
                }
            }

            if (x === trimChars.length) {
                break;
            }
        }
    }

    if (type !== 0) {
        for (; end >= start; end--) {
            var charValue = value[end];
            x = 0;

            for (; x < trimChars.length; x++) {
                if (trimChars[x] === charValue) {
                    break;
                }
            }

            if (x === trimChars.length) {
                break;
            }
        }
    }

    var length = end - start + 1;

    if (length === value.length) {
        return value;
    }

    if (length === 0) {
        return '';
    }

    return value.substr(start, length);
};

/**
* @param {String} value
* @param {Array<Char>|Array<String>} trimChars
* @returns {String}
*/
stringUtils.trimStart = function (value, trimChars) {
    return this.trim(value, trimChars, 0);
};

/**
* @param {String} value
* @param {Array<Char>|Array<String>} trimChars
* @returns {String}
*/
stringUtils.trimEnd = function (value, trimChars) {
    return this.trim(value, trimChars, 1);
};

/**
 * @param {String} value
 * @returns {Boolean}
 */
stringUtils.isNullOrEmpty = function (value) {
    return ((value == null) || (value.length === 0));
};

/**
 * @param {String} value
 * @returns {Boolean}
 */
stringUtils.isNullOrWhiteSpace = function (value) {
    if ((value == null) || (value.length === 0)) {
        return true;
    }

    return /^\s+$/.test(value);
};

module.exports = stringUtils;