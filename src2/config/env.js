export const environments = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
};

export const current =
  environments[process.env.NODE_ENV] || environments.development;

export default current;
