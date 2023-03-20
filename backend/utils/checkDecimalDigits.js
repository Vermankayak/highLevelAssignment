function checkDecimalDigits(balance, decimalPlaces){
    const precisionPoints = balance.toString().split(".")[1];
    return precisionPoints && precisionPoints.length > decimalPlaces;
}

module.exports = checkDecimalDigits