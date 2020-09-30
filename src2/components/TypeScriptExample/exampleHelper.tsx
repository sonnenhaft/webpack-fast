type MakeUppercase = (s: string) => string;

export const makeUppercase: MakeUppercase = str => {
  return str.toUpperCase();
};
