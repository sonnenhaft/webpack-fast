const createValidationFn = fn => {
  /**
   *
   * if you want to improve performance in production, you could return here:
   *
   * if (!__LOCAL__) { return () => {}; }
   *
   * Another option is to move these checks to unit tests when possible if you
   * know they will always be run before a deployment
   */
  return fn;
};

const error = msg => {
  if (__LOCAL__ && __CLIENT__) {
    throw new Error(`Validation: ${msg}`);
  } else {
    console.error(msg);
  }
};

export const validateAreValuesDefined = createValidationFn(obj => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'undefined') {
      error(`Property ${key} should not have 'undefined' as its value`);
    }
  });
});

export const validateAreKeysDefined = obj => {
  Object.keys(obj).forEach(key => {
    if (key === 'undefined') {
      error(`'undefined' key`);
    }
  });
};

export const validateHasDefaultKey = createValidationFn(obj => {
  if (typeof obj.Default === 'undefined') {
    error(`Missing 'Default' key in object`);
  }
});

export const validateContainsAllKeys = createValidationFn((objA, objB) => {
  const objAKeys = Object.keys(objA);

  Object.keys(objB).forEach(objBKey => {
    const objBValue = objB[objBKey];

    if (objAKeys.indexOf(objBValue) === -1) {
      error(`Missing key in object: ${objBValue}`);
    }
  });
});
