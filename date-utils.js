class DateUtils {
  constructor(options) {
    if (options.separators.date) {
      this._separators.date = options.separators.date;
    } else {
      this._separators.date = defaultDateSeparator;
    }

    if (options.separators.time) {
      this._separators.time = options.separators.time;
    } else {
      this._separators.time = defaultTimeSeparator;
    }
  }
}

class Month {
  constructor(month) {
    var monthIndex;
    if (typeof month !== Number) {
      monthIndex = parseInt(month);
      if (typeof monthIndex === undefined) {
        throw 'Argument to Month constructor must be a parsable integer (0-11)';
      }
    } else {
      monthIndex = month;
    }

    if (monthIndex < 0 || monthIndex > 11) {
      throw 'Month index out of range (0-11)';
    }

    this.month = monthIndex;
  }

  asShort() {
    return monthsTextShort[this.month];
  }

  asLong() {
    return monthsTextLong[this.month];
  }

  asNumber() {
    return (this.month + 1).toString();
  }

  asZeroFilledNumber() {
    const monthNum = this.month + 1;
    let monthString = monthNum.toString();
    if (monthNum < 10) {
      monthString = '0' + monthString;
    }
    return monthString;
  }
}

const defaultDateSeparator = '-';
const defaultTimeSeparator = ':';

const monthsTextShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL',
        'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const monthsTextLong = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

const daysTextShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const daysTextLong = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY',
        'FRIDAY', 'SATURDAY'];

module.exports.default = DateUtils;
module.exports = { Month };
