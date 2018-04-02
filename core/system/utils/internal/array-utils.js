'use strict';

const arrayUtils = {};

/**
 * @param {Array} sourceArray
 * @param {Array} destinationArray
 * @param {Number} length
 */
arrayUtils.copyTo = function (sourceArray, destinationArray, length) {
    for (var x = 0; x < length; x++) {
        destinationArray[x] = sourceArray[x];
    }
};

module.exports = arrayUtils;