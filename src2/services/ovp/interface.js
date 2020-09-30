import _isFunction from 'lodash/isFunction';

const REQUIRED_METHODS = [
  'getChannelData',
  'getMovieById',
  'getMovieCategories',
  'getMovieData',
  'getMoviesByCategory',
  'getTvShowData',
  'getTvShowsByCategory',
  'signIn',
  'signOut',
  'validateToken'
];

export const validateOVPInterface = ovpObj => {
  const missingMethods = REQUIRED_METHODS.filter(fnName => {
    return !_isFunction(ovpObj[fnName]);
  });

  if (missingMethods.length > 0) {
    throw new Error(
      `This ovp does not implement all the required methods. Missing: ${missingMethods.join(
        ', '
      )}`
    );
  }

  return ovpObj;
};
