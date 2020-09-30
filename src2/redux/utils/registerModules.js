import forEach from 'lodash/forEach';

// Exporting root state selectors for our modules so the
// components don't have to know about the state shape.
const createAndAddRootSelector = (module, moduleName, mountPoint) => {
  const setRootSelector =
    (module.selectors && module.selectors.setRootSelector) ||
    module.setRootSelector;

  if (!setRootSelector) {
    return;
  }

  if (mountPoint) {
    setRootSelector(state => state[mountPoint][moduleName]);
  } else {
    setRootSelector(state => state[moduleName]);
  }
};

const registerModules = (modules, mountPoint) => {
  forEach(modules, (module, moduleName) =>
    createAndAddRootSelector(module, moduleName, mountPoint)
  );
};

export default registerModules;
