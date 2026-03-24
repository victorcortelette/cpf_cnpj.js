;(function(commonjs){

  /* ================= CPF ================= */

  var CPF_BLACKLIST = [
    "00000000000","11111111111","22222222222","33333333333",
    "44444444444","55555555555","66666666666","77777777777",
    "88888888888","99999999999","12345678909"
  ];

  var cpfVerifierDigit = function(numbers) {
    numbers = numbers.split("").map(function(n){ return parseInt(n, 10); });

    var modulus = numbers.length + 1;

    var sum = numbers.reduce(function(buffer, number, index) {
      return buffer + (number * (modulus - index));
    }, 0);

    var mod = sum % 11;
    return (mod < 2 ? 0 : 11 - mod);
  };

  var CPF = {};

  CPF.strip = function(number) {
    return (number || "").toString().replace(/[^\d]/g, "");
  };

  CPF.isValid = function(number) {
    var stripped = this.strip(number);

    if (!stripped) return false;
    if (stripped.length !== 11) return false;
    if (CPF_BLACKLIST.indexOf(stripped) >= 0) return false;

    var numbers = stripped.substr(0, 9);
    numbers += cpfVerifierDigit(numbers);
    numbers += cpfVerifierDigit(numbers);

    return numbers.substr(-2) === stripped.substr(-2);
  };


  /* ================= CNPJ ================= */

  var CNPJ_BLACKLIST = [
    "00000000000000","11111111111111","22222222222222","33333333333333",
    "44444444444444","55555555555555","66666666666666","77777777777777",
    "88888888888888","99999999999999"
  ];

  var charToCalcValue = function(c) {
    return c.charCodeAt(0) - 48;
  };

  var cnpjVerifierDigit = function(numbers) {
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

  CNPJ.strip = function(number) {
    return (number || "").toString().replace(/[^0-9A-Za-z]/g, "").toUpperCase();
  };

  CNPJ.isValid = function(number) {
    var stripped = this.strip(number);

    if (!stripped) return false;
    if (stripped.length !== 14) return false;

    if (!/^\d{2}$/.test(stripped.substr(12, 2))) return false;
    if (!/^[0-9A-Z]{12}$/.test(stripped.substr(0, 12))) return false;

    if (CNPJ_BLACKLIST.indexOf(stripped) >= 0) return false;

    var numbers = stripped.substr(0, 12);
    numbers += cnpjVerifierDigit(numbers);
    numbers += cnpjVerifierDigit(numbers);

    return numbers.substr(-2) === stripped.substr(-2);
  };


  /* ================= EXPORT ================= */

  if (commonjs) {
    module.exports = {
      CPF: CPF,
      CNPJ: CNPJ
    };
  } else {
    window.CPF = CPF;
    window.CNPJ = CNPJ;
  }

})(typeof(exports) !== "undefined");
