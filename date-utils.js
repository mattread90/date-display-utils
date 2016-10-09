export default class DateUtils {
  static display(dateString) {
    return new DisplayDate(dateString);
  }

  static compare(date1, date2) {
    return new CompareDates(date1, date2);
  }

  static dayOfWeek(dayOfWeek) {
    return new DayOfWeek(dayOfWeek);
  }

  static dayOfMonth(dayOfMonth) {
    return new DayOfMonth(dayOfMonth);
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
    return outputFunction(
      this.dayOfWeek(), this.dayOfMonth(),
      this.month(), this.year(),
      this.hour(), this.minute()
    );
  }

  setTimeOfDay(time, separator) {
    const sep = separator ? separator : ':';
    const [hours, mins] = time.split(sep);
    this.date.setHours(parseInt(hours) + 1);
    this.date.setMinutes(mins);
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

  hour() {
    return new Hour(this.date.getHours());
  }

  minute() {
    return new Minute(this.date.getMinutes());
  }

  toString() {
    return this.date.toString();
  }
}

DateUtils.comparableOutputs = {
  year: (dw, dm, m, y) => `${y.asLong()}`,
  yearMonth: (dw, dm, m, y) => `${y.asLong()}${m.asZeroFilledNumber()}`,
  day: (dw, dm, m , y) =>
    `${y.asLong()}${m.asZeroFilledNumber()}-${dm.asZeroFilledNumber()}`,
  minute: (dw, dm, m, y, h, mi) =>
    `${DateUtils.comparableOutputs.day(dw, dm, m, y)} ${h}:${mi}`
};

export class CompareDates {
  constructor(date1, date2, comparisonOutput) {
    this.date1 = new DisplayDate(date1);
    this.date2 = new DisplayDate(date2);
    this.comparisonOutput = comparisonOutput;
  }

  do() {
    return this.by();
  }

  by(comparisonOutput) {
    if (comparisonOutput) {
      return this._compare(comparisonOutput);
    } else if (this.comparisonOutput) {
      return this._compare(this.comparisonOutput);
    } else {
      let result =
      this.date1.date < this.date2.date ? -1 :
      this.date1.date > this.date2.date ?  1 :
                                           0 ;
      return result;
    }
  }

  static byMinute(date1, date2) {
    return new CompareDates(date1, date2).byMinute();
  }

  byMinute() {
    return this._compare(DateUtils.comparableOutputs.minute);
  }

  static byDay(date1, date2) {
    return new CompareDates(date1, date2).byDay();
  }

  byDay() {
    return this._compare(DateUtils.comparableOutputs.day);
  }

  static byMonth(date1, date2) {
    return new CompareDates(date1, date2).byMonth();
  }

  byMonth() {
    return this._compare(DateUtils.comparableOutputs.yearMonth);
  }

  static byYear(date1, date2) {
    return new CompareDates(date1, date2).byYear();
  }

  byYear() {
    return this._compare(DateUtils.comparableOutputs.year);
  }

  _compare(comparisonOutput) {
    let comparable1 = this.date1.as(comparisonOutput);
    let comparable2 = this.date2.as(comparisonOutput);
    if (comparable1 < comparable2) {
      return -1;
    } else if (comparable1 === comparable2) {
      return 0;
    } else {
      return 1;
    }
  }
}

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

  asNumber() {
    return this.day;
  }

  toString() {
    return this.asLong();
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
    return _pad(this.dayOfMonth.toString());
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

  toString() {
    return this.asNumber();
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
    return _pad(monthNum.toString());
  }

  toString() {
    return this.asNumber();
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

  toString() {
    return this.asLong();
  }
}

export class Hour {
  constructor(hourIndex) {
    this.hour = hourIndex;
  }

  as24hr() {
    let hourText = (this.hour - 1).toString();
    return _pad(hourText);
  }

  as12hr() {
    let hour = this.hour - 1;
    if (hour > 12) hour -= 12;
    return hour.toString();
  }

  getAMPM() {
    return this.hour > 12 ? 'PM' : 'AM';
  }

  toString() {
    return this.as24hr();
  }
}

export class Minute {
  constructor(minute) {
    this.minute = minute;
  }

  asNumber() {
    return _pad(this.minute);
  }

  toString() {
    return this.asNumber();
  }
}

const _pad = (number) => {
  if (typeof number !== 'string') number = number.toString();
  if (number.length < 2) number = '0' + number;
  return number;
};

const JS_DATE_START_YEAR_INDEX = 1900;

const monthsTextLong = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
const monthsTextShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const daysTextLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'];
const daysTextShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const daysTextShortest = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
