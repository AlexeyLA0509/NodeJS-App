'use strict';

/**
 * @enum
 */
const unicodeCategory = {
    uppercaseLetter: 0,
    lowercaseLetter: 1,
    titlecaseLetter: 2,
    modifierLetter: 3,
    otherLetter: 4,
    nonSpacingMark: 5,
    spacingCombiningMark: 6,
    enclosingMark: 7,
    decimalDigitNumber: 8,
    letterNumber: 9,
    otherNumber: 10,
    spaceSeparator: 11,
    lineSeparator: 12,
    paragraphSeparator: 13,
    control: 14,
    format: 15,
    surrogate: 16,
    privateUse: 17,
    connectorPunctuation: 18,
    dashPunctuation: 19,
    openPunctuation: 20,
    closePunctuation: 21,
    initialQuotePunctuation: 22,
    finalQuotePunctuation: 23,
    otherPunctuation: 24,
    mathSymbol: 25,
    currencySymbol: 26,
    modifierSymbol: 27,
    otherSymbol: 28,
    otherNotAssigned: 29
};

module.exports = unicodeCategory;