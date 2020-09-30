import {
  validateAreKeysDefined,
  validateAreValuesDefined,
  validateContainsAllKeys,
  validateHasDefaultKey
} from '../validations';

describe('validateAreValuesDefined', () => {
  it('errors when expected', () => {
    expect(() => validateAreValuesDefined({ foo: undefined })).toThrow(
      "Validation: Property foo should not have 'undefined' as its value"
    );
    expect(() => validateAreValuesDefined({ a: 1, foo: undefined })).toThrow(
      "Validation: Property foo should not have 'undefined' as its value"
    );

    expect(() => validateAreValuesDefined({})).not.toThrow();
    expect(() => validateAreValuesDefined({ a: 1 })).not.toThrow();
    expect(() => validateAreValuesDefined({ a: false })).not.toThrow();
  });
});

describe('validateAreKeysDefined', () => {
  it('errors when expected', () => {
    expect(() => validateAreKeysDefined({ [undefined]: 1 })).toThrow(
      "Validation: 'undefined' key"
    );
    expect(() => validateAreKeysDefined({ a: 1, [undefined]: true })).toThrow(
      "Validation: 'undefined' key"
    );

    expect(() => validateAreKeysDefined({})).not.toThrow();
    expect(() => validateAreKeysDefined({ a: undefined })).not.toThrow();
    expect(() => validateAreKeysDefined({ a: 0 })).not.toThrow();
  });
});

describe('validateHasDefaultKey', () => {
  it('errors when expected', () => {
    expect(() => validateHasDefaultKey({ [undefined]: 1 })).toThrow(
      "Validation: Missing 'Default' key in object"
    );
    expect(() => validateHasDefaultKey({ a: 1 })).toThrow(
      "Validation: Missing 'Default' key in object"
    );

    expect(() => validateHasDefaultKey({ Default: true })).not.toThrow();
    expect(() => validateHasDefaultKey({ Default: null })).not.toThrow();
  });
});

describe('validateContainsAllKeys', () => {
  it('errors when expected', () => {
    expect(() => validateContainsAllKeys({}, { a: 'aVal' })).toThrow(
      'Validation: Missing key in object: aVal'
    );
    expect(() => validateContainsAllKeys({ a: 1 }, { a: 'aVal' })).toThrow(
      'Validation: Missing key in object: aVal'
    );

    expect(() =>
      validateContainsAllKeys({ aVal: 1 }, { a: 'aVal' })
    ).not.toThrow();
  });
});
