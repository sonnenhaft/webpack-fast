export default (str = '') =>
  str.replace(/-([a-z])/g, g => {
    return g[1].toUpperCase();
  });
