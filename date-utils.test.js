import DateUtils, { Day, Month, Year } from './date-utils';

describe('DateUtils', () => {
  it('can convert days, months and years to different formats', () => {
    expect(DateUtils.day(1).asLong()).toBe('MONDAY');
    expect(DateUtils.day(1).asShort()).toBe('MON');
    expect(DateUtils.day(1).asShortest()).toBe('M');

    expect(DateUtils.month(1).asLong()).toBe('FEBRUARY');
    expect(DateUtils.month(1).asShort()).toBe('FEB');
    expect(DateUtils.month(1).asNumber()).toBe('2');
    expect(DateUtils.month(1).asZeroFilledNumber()).toBe('02');

    expect(DateUtils.year(116).asLong()).toBe('2016');
    expect(DateUtils.year(116).asShort()).toBe('16');
    expect(DateUtils.year('2016').asLong()).toBe('2016');
    expect(DateUtils.year('16').asLong()).toBe('2016');
  });
});

describe('Day', () => {
  it('can be constructed with zero-indexed integer', () => {
    let sunday = new Day(0);
    expect(sunday.day).toBe(0);
    let saturday = new Day(6);
    expect(saturday.day).toBe(6);
  });

  it('can be constructed with a parsable string', () => {
    let sunday = new Day('0');
    expect(sunday.day).toBe(0);
    let saturday = new Day('6');
    expect(saturday.day).toBe(6);
  });

  it('can\'t be constructed with zero-indexed integer outside of range', () => {
    var tooSmallExceptionThrown = false;
    var tooBigExceptionThrown = false;
    try {
      var tooSmall = new Day(-1); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooSmallExceptionThrown = true;
    }
    try {
      var tooBig = new Day(7); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooBigExceptionThrown = true;
    }
    expect(tooSmallExceptionThrown).toBe(true);
    expect(tooSmall).toBe(undefined);
    expect(tooBigExceptionThrown).toBe(true);
    expect(tooBig).toBe(undefined);
  });

  it('can\'t be constructed with parsable string outside of range', () => {
    var tooSmallExceptionThrown = false;
    var tooBigExceptionThrown = false;
    try {
      var tooSmall = new Day('-1'); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooSmallExceptionThrown = true;
    }
    try {
      var tooBig = new Day('7'); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooBigExceptionThrown = true;
    }
    expect(tooSmallExceptionThrown).toBe(true);
    expect(tooSmall).toBe(undefined);
    expect(tooBigExceptionThrown).toBe(true);
    expect(tooBig).toBe(undefined);
  });

  it('displays correct days in different forms', () => {
    let sunday = new Day(0);
    expect(sunday.asLong()).toBe('SUNDAY');
    expect(sunday.asShort()).toBe('SUN');
    expect(sunday.asShortest()).toBe('Su');

    let monday = new Day(1);
    expect(monday.asLong()).toBe('MONDAY');
    expect(monday.asShort()).toBe('MON');
    expect(monday.asShortest()).toBe('M');

    let thursday = new Day(4);
    expect(thursday.asLong()).toBe('THURSDAY');
    expect(thursday.asShort()).toBe('THU');
    expect(thursday.asShortest()).toBe('Th');

    let saturday = new Day(6);
    expect(saturday.asLong()).toBe('SATURDAY');
    expect(saturday.asShort()).toBe('SAT');
    expect(saturday.asShortest()).toBe('Sa');
  });

  it('static functions work too', () => {
    expect(Day.asLong(0)).toBe('SUNDAY');
    expect(Day.asShort(0)).toBe('SUN');
    expect(Day.asShortest(0)).toBe('Su');

    expect(Day.asLong(1)).toBe('MONDAY');
    expect(Day.asShort(1)).toBe('MON');
    expect(Day.asShortest(1)).toBe('M');

    expect(Day.asLong(4)).toBe('THURSDAY');
    expect(Day.asShort(4)).toBe('THU');
    expect(Day.asShortest(4)).toBe('Th');

    expect(Day.asLong(6)).toBe('SATURDAY');
    expect(Day.asShort(6)).toBe('SAT');
    expect(Day.asShortest(6)).toBe('Sa');
  });
});

describe('Month', () => {
  it('can be constructed with zero-indexed integer', () => {
    let january = new Month(0);
    expect(january.asLong()).toBe('JANUARY');
    let december = new Month(11);
    expect(december.asLong()).toBe('DECEMBER');
  });

  it('can be constructed with a parsable string', () => {
    let january = new Month('0');
    expect(january.asLong()).toBe('JANUARY');
    let december = new Month('11');
    expect(december.asLong()).toBe('DECEMBER');
  });

  it('can\'t be constructed with zero-indexed integer outside of range', () => {
    var tooSmallExceptionThrown = false;
    var tooBigExceptionThrown = false;
    try {
      var tooSmall = new Month(-1); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooSmallExceptionThrown = true;
    }
    try {
      var tooBig = new Month(13); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooBigExceptionThrown = true;
    }
    expect(tooSmallExceptionThrown).toBe(true);
    expect(tooSmall).toBe(undefined);
    expect(tooBigExceptionThrown).toBe(true);
    expect(tooBig).toBe(undefined);
  });

  it('can\'t be constructed with parsable string outside of range', () => {
    var tooSmallExceptionThrown = false;
    var tooBigExceptionThrown = false;
    try {
      var tooSmall = new Month('-1'); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooSmallExceptionThrown = true;
    }
    try {
      var tooBig = new Month('13'); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooBigExceptionThrown = true;
    }
    expect(tooSmallExceptionThrown).toBe(true);
    expect(tooSmall).toBe(undefined);
    expect(tooBigExceptionThrown).toBe(true);
    expect(tooBig).toBe(undefined);
  });

  it('can\'t be constructed with unparsable string', () => {
    var exceptionThrown = false;
    try {
      var notADate = new Month('Movember'); //eslint-disable-line no-unused-vars
      console.log(notADate);
    } catch (e) {
      exceptionThrown = true;
    }
    expect(exceptionThrown).toBe(true);
    expect(notADate).toBe(undefined);
  });

  it('displays correct months in different forms', () => {
    let january = new Month(0);
    expect(january.asLong()).toBe('JANUARY');
    expect(january.asShort()).toBe('JAN');
    expect(january.asNumber()).toBe('1');
    expect(january.asZeroFilledNumber()).toBe('01');

    let june = new Month(5);
    expect(june.asLong()).toBe('JUNE');
    expect(june.asShort()).toBe('JUN');
    expect(june.asNumber()).toBe('6');
    expect(june.asZeroFilledNumber()).toBe('06');

    let october = new Month(9);
    expect(october.asLong()).toBe('OCTOBER');
    expect(october.asShort()).toBe('OCT');
    expect(october.asNumber()).toBe('10');
    expect(october.asZeroFilledNumber()).toBe('10');

    let december = new Month(11);
    expect(december.asLong()).toBe('DECEMBER');
    expect(december.asShort()).toBe('DEC');
    expect(december.asNumber()).toBe('12');
    expect(december.asZeroFilledNumber()).toBe('12');
  });

  it('static functions work too', () => {
    expect(Month.asLong(0)).toBe('JANUARY');
    expect(Month.asShort(0)).toBe('JAN');
    expect(Month.asNumber(0)).toBe('1');
    expect(Month.asZeroFilledNumber(0)).toBe('01');

    expect(Month.asLong(5)).toBe('JUNE');
    expect(Month.asShort(5)).toBe('JUN');
    expect(Month.asNumber(5)).toBe('6');
    expect(Month.asZeroFilledNumber(5)).toBe('06');

    expect(Month.asLong(9)).toBe('OCTOBER');
    expect(Month.asShort(9)).toBe('OCT');
    expect(Month.asNumber(9)).toBe('10');
    expect(Month.asZeroFilledNumber(9)).toBe('10');

    expect(Month.asLong(11)).toBe('DECEMBER');
    expect(Month.asShort(11)).toBe('DEC');
    expect(Month.asNumber(11)).toBe('12');
    expect(Month.asZeroFilledNumber(11)).toBe('12');
  });
});

describe('Year', () => {
  it('can be constructed with ints', () => {
    let millenium = new Year(100); //eslint-disable-line no-unused-vars
    let twentiethCentury = new Year(0); //eslint-disable-line no-unused-vars
    let oldenDays = new Year(-156); //eslint-disable-line no-unused-vars
  });

  it('can be constructed with strings', () => {
    let millenium = new Year('2000'); //eslint-disable-line no-unused-vars
    expect(millenium.year).toBe(2000);
    let thisYear = new Year('16'); //eslint-disable-line no-unused-vars
    expect(thisYear.year).toBe(2016);
  });

  it('can\'t be constructed with unparsable strings', () => {
    var exceptionThrown = false;
    try {
      let notThisYear = new Year('yearOfTheHorse'); //eslint-disable-line no-unused-vars
    } catch(e) {
      exceptionThrown = true;
    }
    expect(exceptionThrown).toBe(true);
  });

  it('can display in full', () => {
    let millenium = new Year(100);
    expect(millenium.asLong()).toBe('2000');

    let twentiethCentury = new Year(0);
    expect(twentiethCentury.asLong()).toBe('1900');

    let oldenDays = new Year(-156);
    expect(oldenDays.asLong()).toBe('1744');
  });

  it('can display in short', () => {
    let millenium = new Year(100);
    expect(millenium.asShort()).toBe('00');

    let twentiethCentury = new Year(0);
    expect(twentiethCentury.asShort()).toBe('00');

    let oldenDays = new Year(-156);
    expect(oldenDays.asShort()).toBe('44');
  });

  it('static functions work too', () => {
    expect(Year.asLong(100)).toBe('2000');
    expect(Year.asLong(0)).toBe('1900');
    expect(Year.asLong(-156)).toBe('1744');
    expect(Year.asLong('2016')).toBe('2016');
    expect(Year.asLong('16')).toBe('2016');
    expect(Year.asShort(100)).toBe('00');
    expect(Year.asShort(0)).toBe('00');
    expect(Year.asShort(-156)).toBe('44');
    expect(Year.asShort('2016')).toBe('16');
    expect(Year.asShort('16')).toBe('16');
  });
});
