'use strict';

var App = {};

App.Ajax = {
    create: function ()
    {
        var request = null;

        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }

        return request;
    },

    sendData: function (request, url, method, headers, data)
    {
        request.open(method, url, true);

        if ((headers === null) || (headers.length === 0)) {
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        else {
            for (var x = 0; x < headers.length; x++) {
                var header = headers[x];
                request.setRequestHeader(header[0], header[1]);
            }
        }

        if (data != null) {
            request.send(data);
        }
        else {
            request.send();
        }
    }
};

App.addClass = function (element, value) {
    if (element != null) {
        element.className += ((element.className.length > 0) ? ' ' : '') + value;
    }
};

App.removeClass = function (element, value) {
    if (element != null) {
        if (this.hasClass(element, value) == true) {
            var newClassName = (' ' + element.className + ' ').replace(' ' + value + ' ', ' ');

            if (newClassName[0] === ' ') {
                newClassName = newClassName.substr(1, newClassName.length - 1);
            }

            if (newClassName[newClassName.length - 1] === ' ') {
                newClassName = newClassName.substr(0, newClassName.length - 1);
            }

            element.className = newClassName;
            return true;
        }
    }

    return false;
};

App.hasClass = function (element, value) {
    return element && value && (' ' + element.className + ' ').indexOf(' ' + value + ' ') !== -1;
};

/**
* @returns {FormData}
*/
App.createFormatData = function (file)
{
    var formData = new FormData();
    formData.append('file', file);

    return formData;
};

/**
* @param {Request} request
* @param {FormData} formData
*/
App.sendFile = function (request, formData)
{
    request.open('POST', 'upload', true);
    request.send(formData);
};

App.array = {};

App.array.copyTo = function (sourceArray, destinationArray, length)
{
    for (var x = 0; x < length; x++) {
        destinationArray[x] = sourceArray[x];
    }
};

/**
* @param {Array} items
* @param {Number|String} id
* @returns {Object}
*/
App.array.getItemById = function (items, id)
{
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
* @param {Object} item
* @returns {Object}
*/
App.array.removeItem = function (items, item)
{
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
App.array.removeItemById = function (items, id)
{
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
App.array.removeItemByIndex = function (items, index)
{
    var removed = items.splice(index, 1);

    return ((removed.length > 0) ? removed[0] : null);
};

/**
* Clear childNodes.
*
* @param {Element} element
*/
App.clearChildNodes = function (element) {
    if (!element || !element.childNodes) {
        throw new Error('Invalid Element.');
    }

    if (element.childNodes.length < 1) {
        return;
    }

    var range = document.createRange();
    range.selectNodeContents(element);
    range.deleteContents();
};

/**
* Replace Ampersand ("&") on "\u0026".
*
* @param {String} text
* @param {Boolean} [global] Default: true.
* @returns {String}
*/
App.replaceAmpersand = function (text, global)
{
    return text.replace((((global == null) || (global === true)) ? /&/g : /&/), '\\u0026');
};

/**
* Start End Chars
*/
App.SEChars = [' ', '\n', '\r', '\t'];

/**
* Has Start End Chars
*
* @param {Char} ch
* @returns {Boolean}
*/
App.hasSEChars = function (ch)
{
    return ((ch === ' ') || (ch === '\n') || (ch === '\r') || (ch === '\t'));
};

App.string = {};

/**
* @param {String} value
* @param {Array} trimChars trimChars: Char[] (String[])
* @param {Number} [type] Type: 0 - start, 1 - end, 2 - both
* @returns {String}
*/
App.string.trim = function (value, trimChars, type)
{
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
* @param {Array} trimChars trimChars: Char[] (String[])
* @returns {String}
*/
App.string.trimStart = function (value, trimChars)
{
    return this.trim(value, trimChars, 0);
};

/**
* @param {String} value
* @param {Array} trimChars trimChars: Char[] (String[])
* @returns {String}
*/
App.string.trimEnd = function (value, trimChars)
{
    return this.trim(value, trimChars, 1);
};

/**
* @param {Element} element
* @param {String} className
* @returns {Array<Element>}
*/
App.getElementsFromChildNodesByClassName = function (element, className)
{
    var elements = new Array();

    if ((element == null) || (className == null)) {
        return elements;
    }

    for (var x = 0; x < element.childNodes.length; x++) {
        var node = element.childNodes[x];

        if ((node.nodeType !== 1) || (this.hasClass(node, className) == false)) {
            continue;
        }

        elements.push(node);
    }

    return elements;
};

App.dataValidation = {};

App.dataValidation.isEmailValid = (function ()
{
    var emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

    /**
    * @param {String} email
    * @returns {Boolean}
    */
    return function (email)
    {
        if ((email == null) || (typeof email !== 'string') || (email.length < 1)) {
            return false;
        }

        return emailRegex.test(email);
    };
})();