;(function(commonjs){
  var BLACKLIST = [
    "00000000000000","11111111111111","22222222222222","33333333333333",
    "44444444444444","55555555555555","66666666666666","77777777777777",
    "88888888888888","99999999999999"
  ];

  var STRICT_STRIP_REGEX = /[-\/.]/g;
  var LOOSE_STRIP_REGEX = /[^0-9A-Za-z]/g;

  var charToCalcValue = function(c) {
    return c.charCodeAt(0) - 48;
  };

  var verifierDigit = function(numbers) {
    var index = 2;

    var reverse = numbers.split("").reduce(function(buffer, c) {
      return [charToCalcValue(c)].concat(buffer);
    }, []);

    var sum = reverse.reduce(function(buffer, number) {
      buffer += number * index;
      index = (index === 9 ? 2 : index + 1);
      return buffer;
    }, 0);

    var mod = sum % 11;
    return (mod < 2 ? 0 : 11 - mod);
  };

  var CNPJ = {};

  CNPJ.format = function(number) {
    return this.strip(number).replace(/^(.{2})(.{3})(.{3})(.{4})(.{2})$/, "$1.$2.$3/$4-$5");
  };

  CNPJ.strip = function(number, strict) {
    var regex = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
    return (number || "").toString().replace(regex, "").toUpperCase();
  };

  CNPJ.isValid = function(number, strict) {
    var stripped = this.strip(number, strict);

    if (!stripped) return false;
    if (stripped.length !== 14) return false;

    if (!/^\d{2}$/.test(stripped.substr(12, 2))) return false;

    if (!/^[0-9A-Z]{12}$/.test(stripped.substr(0, 12))) return false;

    if (BLACKLIST.indexOf(stripped) >= 0) return false;

    var numbers = stripped.substr(0, 12);
    numbers += verifierDigit(numbers);
    numbers += verifierDigit(numbers);

    return numbers.substr(-2) === stripped.substr(-2);
  };

  CNPJ.generate = function(formatted) {
    var numbers = "";
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 12; i++) {
      numbers += chars[Math.floor(Math.random() * chars.length)];
    }

    numbers += verifierDigit(numbers);
    numbers += verifierDigit(numbers);

    return (formatted ? this.format(numbers) : numbers);
  };

  if (commonjs) {
    module.exports = CNPJ;
  } else {
    window.CNPJ = CNPJ;
  }
})(typeof(exports) !== "undefined");
