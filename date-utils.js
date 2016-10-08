export default class DateUtils {
  constructor(options) {
    if (options) {
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

  static display(dateString) {
    return new DisplayDate(dateString);
  }

  static dayOfWeek(dayOfWeek) {
    return new DayOfWeek(dayOfWeek);
  }

  static month(month) {
    return new Month(month);
  }

  static year(year) {
    return new Year(year);
  }
}

export class DisplayDate {
  constructor(dateString, outputFunction) {
    this.date = new Date(dateString);
    this.outputFunction = outputFunction;
  }

  static as(dateString, outputFunction) {
    return new DisplayDate(dateString).as(outputFunction);
  }

  as(outputFunction) {
    return this._output(this.date, outputFunction);
  }

  get() {
    return this._output(this.date, this.outputFunction);
  }

  _output(date, outputFunction) {
    const d = this.date;
    return outputFunction(
      this.dayOfWeek(), this.dayOfMonth(),
      this.month(), this.year(),
      d.getHours(), d.getMinutes()
    );
  }

  dayOfWeek() {
    return new DayOfWeek(this.date.getDay());
  }

  dayOfMonth() {
    return new DayOfMonth(this.date.getDate());
  }

  month() {
    return new Month(this.date.getMonth());
  }

  year() {
    return new Year(this.date.getYear());
  }

  static compareByMonth(displayDate1, displayDate2) {
    if (typeof displayDate1 === 'string')
      displayDate1 = new DisplayDate(displayDate1);
    if (typeof displayDate2 === 'string')
      displayDate2 = new DisplayDate(displayDate2);
    let comparable1 = displayDate1.as(DisplayDate.comparableOutputs.yearMonth);
    let comparable2 = displayDate2.as(DisplayDate.comparableOutputs.yearMonth);
    if (comparable1 < comparable2) {
      return -1;
    } else if (comparable1 === comparable2) {
      return 0;
    } else {
      return 1;
    }
  }
}

DisplayDate.comparableOutputs = {
  yearMonth: (dw, dm, m, y) => `${y.asLong()}${m.asZeroFilledNumber()}`,
  year: (dw, dm, m, y) => `${y.asLong()}`
};

export class DayOfWeek {
  constructor(day) {
    var dayIndex;
    if (typeof day !== Number) {
      dayIndex = parseInt(day);
      if (isNaN(dayIndex) || typeof dayIndex === undefined) {
        throw 'Argument to DayOfWeek constructor must be a parsable integer (0-6)';
      }
    } else {
      dayIndex = day;
    }

    if (dayIndex < 0 || dayIndex > 6) {
      throw 'DayOfWeek index out of range (0-6)';
    }

    this.day = dayIndex;
  }

  static asLong(day) {
    return new DayOfWeek(day).asLong();
  }

  asLong() {
    return daysTextLong[this.day];
  }

  static asShort(day) {
    return new DayOfWeek(day).asShort();
  }

  asShort() {
    return daysTextShort[this.day];
  }

  static asShortest(day) {
    return new DayOfWeek(day).asShortest();
  }

  asShortest() {
    return daysTextShortest[this.day];
  }
}

export class DayOfMonth {
  constructor(dayOfMonth) {
    this.dayOfMonth = dayOfMonth;
  }

  asNumber() {
    return this.dayOfMonth.toString();
  }

  asZeroFilledNumber() {
    let dayString = this.dayOfMonth.toString();
    if (dayString < 10) {
      dayString = '0' + dayString;
    }
    return dayString;
  }

  withSuffix() {
    return this.asNumber() + this.justSuffix();
  }

  justSuffix() {
    const text = this.asNumber();
    if (text.endsWith('1') && text !== '11') {
      return 'st';
    } else if (text.endsWith('2') && text !== '12') {
      return 'nd';
    } else if (text.endsWith('3') && text !== '13') {
      return 'rd';
    } else {
      return 'th';
    }
  }
}

export class Month {
  constructor(month) {
    var monthIndex;
    if (typeof month !== 'number') {
      monthIndex = parseInt(month);
      if (isNaN(monthIndex) || typeof monthIndex === undefined) {
        throw 'Argument to Day constructor must be a parsable integer (0-11)';
      }
    } else {
      monthIndex = month;
    }

    if (monthIndex < 0 || monthIndex > 11) {
      throw 'Month index out of range (0-11)';
    }

    this.month = monthIndex;
  }

  static asLong(month) {
    return new Month(month).asLong();
  }

  asLong() {
    return monthsTextLong[this.month];
  }

  static asShort(month) {
    return new Month(month).asShort();
  }

  asShort() {
    return monthsTextShort[this.month];
  }

  static asNumber(month) {
    return new Month(month).asNumber();
  }

  asNumber() {
    return (this.month + 1).toString();
  }

  static asZeroFilledNumber(month) {
    return new Month(month).asZeroFilledNumber();
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

export class Year {
  constructor(year) {
    if (typeof year == 'number') {
      this.year = JS_DATE_START_YEAR_INDEX + year;
    } else {
      let yearInt = parseInt(year);
      if (isNaN(yearInt) || typeof yearInt === undefined) {
        throw 'Argument to Year constructor must be a parsable integer';
      }
      // If passed a string, it's probably the actual year in short or full form
      if (yearInt > 0) {
        if (yearInt < 100) {
          this.year = 2000 + yearInt;
        } else {
          this.year = yearInt;
        }
      } else {
        throw 'Not sure what to do with this arugment to Year constructor: '
                + year;
      }
    }
  }

  static asLong(year) {
    return new Year(year).asLong();
  }

  asLong() {
    return this.year.toString();
  }

  static asShort(year) {
    return new Year(year).asShort();
  }

  asShort() {
    return this.year.toString().substr(2,4);
  }
}

const JS_DATE_START_YEAR_INDEX = 1900;

const defaultDateSeparator = '-';
const defaultTimeSeparator = ':';

const monthsTextLong = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const monthsTextShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL',
        'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const daysTextLong = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY',
        'FRIDAY', 'SATURDAY'];
const daysTextShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const daysTextShortest = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
