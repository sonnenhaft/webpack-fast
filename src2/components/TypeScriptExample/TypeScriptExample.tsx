import React from 'react';

import { makeUppercase } from './exampleHelper';

type TypeScriptExample = React.FC<{
  foo: string;
}>;

const TypeScriptExample: TypeScriptExample = ({ foo }) => {
  return <div>TypeScript Example. {makeUppercase(foo)}</div>;
};

export default TypeScriptExample;
