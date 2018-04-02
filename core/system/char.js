'use strict';

const maxValue = String.fromCharCode(0xFFFF);
const minValue = String.fromCharCode(0x00);

class Char {
    /**
     * @param {String} value
     */
    constructor(value) {
        this.value = value[0];
    }

    static get MaxValue() {
        return maxValue;
    }

    static get MinValue() {
        return minValue;
    }

    /**
     * @param {String} c Character.
     * @returns {Boolean}
     */
    static isLatin1(c) {
        return (c <= '\u00ff');
    }

    /**
     * @param {String} c Character.
     * @returns {Boolean}
     */
    static isAscii(c) {
        return (c <= '\u007f');
    }

    /**
     * @param {String} c Character.
     * @returns {Boolean}
     */
    static isWhiteSpace(c) {
        if (Char.isLatin1(c)) {
            return Char.isWhiteSpaceLatin1(c);
        }

        return /^\s/.test(c);
    }

    /**
     * @param {String} c Character.
     * @returns {Boolean}
     */
    static isWhiteSpaceLatin1(c) {
        /*
        U+0009 = <control> HORIZONTAL TAB
        U+000a = <control> LINE FEED
        U+000b = <control> VERTICAL TAB
        U+000c = <contorl> FORM FEED
        U+000d = <control> CARRIAGE RETURN
        U+0085 = <control> NEXT LINE
        U+00a0 = NO-BREAK SPACE
        */
        if ((c === ' ') || ((c >= '\u0009') && (c <= '\u000d')) || (c === '\u00a0') || (c === '\u0085')) {
            return true;
        }

        return false;
    }
}

module.exports = Char;