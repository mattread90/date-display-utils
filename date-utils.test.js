import DateUtils, { Month } from './date-utils';

describe('DateUtils', () => {

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
  })
});
