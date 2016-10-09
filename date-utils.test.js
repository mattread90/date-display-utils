import DateUtils, { DayOfWeek, DayOfMonth, Month, Year, DisplayDate, CompareDates } from './date-utils';

describe('DateUtils', () => {
  it('can expose DayOfWeek, DayOfMonth, Month and Year functionalities', () => {
    expect(DateUtils.dayOfWeek(1).asLong()).toBe('Monday');
    expect(DateUtils.dayOfWeek(1).asShort()).toBe('Mon');
    expect(DateUtils.dayOfWeek(1).asShortest()).toBe('M');

    expect(DateUtils.dayOfMonth(1).asNumber()).toBe('1');
    expect(DateUtils.dayOfMonth(1).asZeroFilledNumber()).toBe('01');
    expect(DateUtils.dayOfMonth(1).withSuffix()).toBe('1st');
    expect(DateUtils.dayOfMonth(1).justSuffix()).toBe('st');

    expect(DateUtils.month(1).asLong()).toBe('February');
    expect(DateUtils.month(1).asShort()).toBe('Feb');
    expect(DateUtils.month(1).asNumber()).toBe('2');
    expect(DateUtils.month(1).asZeroFilledNumber()).toBe('02');

    expect(DateUtils.year(116).asLong()).toBe('2016');
    expect(DateUtils.year(116).asShort()).toBe('16');
    expect(DateUtils.year('2016').asLong()).toBe('2016');
    expect(DateUtils.year('16').asLong()).toBe('2016');
  });

  it('can expose DisplayDate functionality', () => {
    expect(DateUtils.display('2016-10-09').as((dw, dm, m, y) =>
      `${dw.asLong()} ${dm.withSuffix()} ${m.asLong()} ${y.asLong()}`))
      .toBe('Sunday 9th October 2016');
  });

  it('can expose CompareDates functionality', () => {
    expect(DateUtils.compare('2016-10-09', '2016-10-10').byMonth()).toBe(0);
  });
});

describe('DisplayDate', () => {
  it('can be used to convert various input dates to various output dates', () => {
    let oct2016 = new DisplayDate('2016-10');
    expect(oct2016
        .as((dw, dm, m, y) => `${m.asLong()}, ${y.asLong()}`))
        .toBe('October, 2016');
    expect(oct2016
        .as((dw, dm, m, y) => `${m.asShort()} ${y.asShort()}`))
        .toBe('Oct 16');

    let nov2016 = new DisplayDate('November, 2016');
    expect(nov2016.as((dw, dm, m, y) =>
          `${m.asZeroFilledNumber()}/${y.asShort()}`))
        .toBe('11/16');
    expect(nov2016.as((dw, dm, m, y) => `${m.asShort()} '${y.asShort()}`))
        .toBe('Nov \'16');

    let christmas = new DisplayDate('25 December 2016');
    expect(christmas.as((dw) => `Christmas is on a ${dw.asLong()}`))
        .toBe('Christmas is on a Sunday');
    expect(christmas.as((dw, dm, m) => {
      if (dm.asNumber() === '25' && m.asNumber() === '12') return 'OMG Santa!';
    }))
        .toBe('OMG Santa!');

    let starWarsDay = new DisplayDate('2016-05-4');
    expect(starWarsDay.as((dw, dm, m) =>
            `${m.asLong()} the ${dm.withSuffix()} be with you`))
      .toBe('May the 4th be with you');

    let verySpecialDay = new DisplayDate('1990-12-09');
    expect(verySpecialDay.as((dw, dm, m, y) =>
      `${dw.asLong()} the ${dm.withSuffix()} of ${m.asLong()}, ${y.asLong()}`))
      .toBe('Sunday the 9th of December, 1990');
  });
});

describe('CompareDates', () => {
  it('can be used to compare dates by month', () => {
    expect(new CompareDates('2016-10', '2016-11').byMonth()).toBeLessThan(0);
    expect(new CompareDates('2016-10-1', '2016-10-31').byMonth()).toBe(0);
    expect(new CompareDates('2016-11', '2016-10').byMonth()).toBeGreaterThan(0);
  });

  it('can be used to compare dates by year', () => {
    expect(new CompareDates('2015-12-31', '2016-01-01').byYear()).toBeLessThan(0);
    expect(new CompareDates('2016-01-01', '2016-12-31').byYear()).toBe(0);
    expect(new CompareDates('2016-01-01', '2015-12').byYear()).toBeGreaterThan(0);
  });

  it('can be used to compare dates by day', () => {
    expect(new CompareDates('2016-12-25', '2016-12-26').byDay()).toBeLessThan(0);
    expect(new CompareDates('2016-12-25', '2016-12-25').byDay()).toBe(0);
    expect(new CompareDates('2016-12-26', '2016-12-25').byDay()).toBeGreaterThan(0);
  });

  it('can be used to compare dates by minute', () => {
    expect(new CompareDates('2016-12-25 12:00', '2016-12-25 12:01')
                            .byMinute()).toBeLessThan(0);
    expect(new CompareDates('2016-12-25 12:00', '2016-12-25 12:00')
                            .byMinute()).toBe(0);
    expect(new CompareDates('2016-12-25 12:01', '2016-12-25 12:00')
                            .byMinute()).toBeGreaterThan(0);
  });

  it('can compare dates using custom outputs', () => {
    let century = (dw, dm, m, y) => `${y.asLong().substr(0,2)}`;
    expect(new CompareDates('2016-12-25', '1916-12-25').by(century))
        .toBeGreaterThan(0);
    expect(new CompareDates('2016-12-25', '2045-12-25').by(century))
        .toBe(0);

    let dayOfWeek = (dw) => `${dw.asNumber()}`;
    // Both Sundays:
    expect(new CompareDates('1990-12-09', '2016-10-09').by(dayOfWeek))
        .toBe(0);
  });

  it('can simply compare the internal Date objects', () => {
    let now = new Date();
    let alsoNow = new Date(now);
    expect(new CompareDates(now, alsoNow).do()).toBe(0);

    let then = alsoNow.setMilliseconds(alsoNow.getMilliseconds() - 1);
    expect(new CompareDates(now, then).do()).toBeGreaterThan(0);
    expect(new CompareDates(then, now).do()).toBeLessThan(0);
  });
});

describe('DayOfWeek', () => {
  it('can be constructed with zero-indexed integer', () => {
    let sunday = new DayOfWeek(0);
    expect(sunday.day).toBe(0);
    let saturday = new DayOfWeek(6);
    expect(saturday.day).toBe(6);
  });

  it('can be constructed with a parsable string', () => {
    let sunday = new DayOfWeek('0');
    expect(sunday.day).toBe(0);
    let saturday = new DayOfWeek('6');
    expect(saturday.day).toBe(6);
  });

  it('can\'t be constructed with zero-indexed integer outside of range', () => {
    var tooSmallExceptionThrown = false;
    var tooBigExceptionThrown = false;
    try {
      var tooSmall = new DayOfWeek(-1); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooSmallExceptionThrown = true;
    }
    try {
      var tooBig = new DayOfWeek(7); //eslint-disable-line no-unused-vars
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
      var tooSmall = new DayOfWeek('-1'); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooSmallExceptionThrown = true;
    }
    try {
      var tooBig = new DayOfWeek('7'); //eslint-disable-line no-unused-vars
    } catch (e) {
      tooBigExceptionThrown = true;
    }
    expect(tooSmallExceptionThrown).toBe(true);
    expect(tooSmall).toBe(undefined);
    expect(tooBigExceptionThrown).toBe(true);
    expect(tooBig).toBe(undefined);
  });

  it('displays correct days in different forms', () => {
    let sunday = new DayOfWeek(0);
    expect(sunday.asLong()).toBe('Sunday');
    expect(sunday.asShort()).toBe('Sun');
    expect(sunday.asShortest()).toBe('Su');

    let monday = new DayOfWeek(1);
    expect(monday.asLong()).toBe('Monday');
    expect(monday.asShort()).toBe('Mon');
    expect(monday.asShortest()).toBe('M');

    let thursday = new DayOfWeek(4);
    expect(thursday.asLong()).toBe('Thursday');
    expect(thursday.asShort()).toBe('Thu');
    expect(thursday.asShortest()).toBe('Th');

    let saturday = new DayOfWeek(6);
    expect(saturday.asLong()).toBe('Saturday');
    expect(saturday.asShort()).toBe('Sat');
    expect(saturday.asShortest()).toBe('Sa');
  });

  it('static functions work too', () => {
    expect(DayOfWeek.asLong(0)).toBe('Sunday');
    expect(DayOfWeek.asShort(0)).toBe('Sun');
    expect(DayOfWeek.asShortest(0)).toBe('Su');

    expect(DayOfWeek.asLong(1)).toBe('Monday');
    expect(DayOfWeek.asShort(1)).toBe('Mon');
    expect(DayOfWeek.asShortest(1)).toBe('M');

    expect(DayOfWeek.asLong(4)).toBe('Thursday');
    expect(DayOfWeek.asShort(4)).toBe('Thu');
    expect(DayOfWeek.asShortest(4)).toBe('Th');

    expect(DayOfWeek.asLong(6)).toBe('Saturday');
    expect(DayOfWeek.asShort(6)).toBe('Sat');
    expect(DayOfWeek.asShortest(6)).toBe('Sa');
  });
});

describe('DayOfMonth', () => {
  it('can display the dates with st suffix', () => {
    let first = new DayOfMonth(1);
    let twentyFirst = new DayOfMonth(21);
    let thirtyFirst = new DayOfMonth(31);
    expect(first.withSuffix()).toBe('1st');
    expect(twentyFirst.withSuffix()).toBe('21st');
    expect(thirtyFirst.withSuffix()).toBe('31st');
  });

  it('can display the dates with nd suffix', () => {
    let second = new DayOfMonth(2);
    let twentySecond = new DayOfMonth(22);
    expect(second.withSuffix()).toBe('2nd');
    expect(twentySecond.withSuffix()).toBe('22nd');
  });

  it('can display the dates with rd suffix', () => {
    let third = new DayOfMonth(3);
    let twentyThird = new DayOfMonth(23);
    expect(third.withSuffix()).toBe('3rd');
    expect(twentyThird.withSuffix()).toBe('23rd');
  });

  it('can display the dates with th suffix', () => {
    let thDates = [];
    for (let i = 4; i < 31; i++) {
      if (![1, 2, 3, 21, 22, 23, 31].includes(i)) {
        thDates.push(i);
      }
    }
    for (let date of thDates) {
      let toDisplay = new DayOfMonth(date);
      expect(toDisplay.justSuffix()).toBe('th');
    }
  });
});

describe('Month', () => {
  it('can be constructed with zero-indexed integer', () => {
    let january = new Month(0);
    expect(january.asLong()).toBe('January');
    let december = new Month(11);
    expect(december.asLong()).toBe('December');
  });

  it('can be constructed with a parsable string', () => {
    let january = new Month('0');
    expect(january.asLong()).toBe('January');
    let december = new Month('11');
    expect(december.asLong()).toBe('December');
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
    expect(january.asLong()).toBe('January');
    expect(january.asShort()).toBe('Jan');
    expect(january.asNumber()).toBe('1');
    expect(january.asZeroFilledNumber()).toBe('01');

    let june = new Month(5);
    expect(june.asLong()).toBe('June');
    expect(june.asShort()).toBe('Jun');
    expect(june.asNumber()).toBe('6');
    expect(june.asZeroFilledNumber()).toBe('06');

    let october = new Month(9);
    expect(october.asLong()).toBe('October');
    expect(october.asShort()).toBe('Oct');
    expect(october.asNumber()).toBe('10');
    expect(october.asZeroFilledNumber()).toBe('10');

    let december = new Month(11);
    expect(december.asLong()).toBe('December');
    expect(december.asShort()).toBe('Dec');
    expect(december.asNumber()).toBe('12');
    expect(december.asZeroFilledNumber()).toBe('12');
  });

  it('static functions work too', () => {
    expect(Month.asLong(0)).toBe('January');
    expect(Month.asShort(0)).toBe('Jan');
    expect(Month.asNumber(0)).toBe('1');
    expect(Month.asZeroFilledNumber(0)).toBe('01');

    expect(Month.asLong(5)).toBe('June');
    expect(Month.asShort(5)).toBe('Jun');
    expect(Month.asNumber(5)).toBe('6');
    expect(Month.asZeroFilledNumber(5)).toBe('06');

    expect(Month.asLong(9)).toBe('October');
    expect(Month.asShort(9)).toBe('Oct');
    expect(Month.asNumber(9)).toBe('10');
    expect(Month.asZeroFilledNumber(9)).toBe('10');

    expect(Month.asLong(11)).toBe('December');
    expect(Month.asShort(11)).toBe('Dec');
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
      let notReallyAYear = new Year('yearOfTheHorse'); //eslint-disable-line no-unused-vars
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
