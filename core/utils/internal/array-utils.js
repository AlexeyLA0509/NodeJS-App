'use strict';

const arrayUtils = {};

/**
* @param {Array} items
* @param {Number|String} id
* @returns {Object}
*/
arrayUtils.getItemById = function (items, id) {
    for (var x = 0; x < items.length; x++) {
        var item = items[x];

        if (item.id === id) {
            return item;
        }
    }

    return null;
};

/**
* @param {Array} items
* @param {String} propertyName
* @param {*} value
* @returns {Object}
*/
arrayUtils.getItemByValueOfProperty = function (items, propertyName, value) {
    for (var x = 0; x < items.length; x++) {
        var item = items[x];

        if (item[propertyName] === value) {
            return item;
        }
    }

    return null;
};

/**
* @param {Array} items
* @param {Object} item
* @returns {Object}
*/
arrayUtils.removeItem = function (items, item) {
    var index = items.indexOf(item);

    if (index < 0) {
        return null;
    }

    return this.removeItemByIndex(items, index);
};

/**
* @param {Number|String} id
* @returns {Object}
*/
arrayUtils.removeItemById = function (items, id) {
    for (var x = 0; x < items.length; x++) {
        var item = items[x];

        if (item.id === id) {
            return this.removeItemByIndex(items, x);
        }
    }

    return null;
};

/**
* @param {Number} index
* @returns {Object}
*/
arrayUtils.removeItemByIndex = function (items, index) {
    var removed = items.splice(index, 1);

    return ((removed.length > 0) ? removed[0] : null);
};

module.exports = arrayUtils;