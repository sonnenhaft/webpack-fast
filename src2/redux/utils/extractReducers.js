import reduce from 'lodash/reduce';

const extractReducers = modules => {
  return reduce(
    modules,
    (acc, module, name) => {
      // We don't care about modules without reducers
      if (!module || !module.reducer) {
        return acc;
      }

      // Merge the reducer into the combined object
      return {
        ...acc,
        [name]: module.reducer
      };
    },
    {}
  );
};

export default extractReducers;
