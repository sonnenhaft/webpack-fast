import React from 'react';

export default () => {
  if (process.env.NODE_ENV !== 'production') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');

    console.info('using whyDidYouRender');

    whyDidYouRender(React, {
      include: [/./],
      exclude: [
        /ConfigLoader/,
        /^Focus$/,
        /^Route$/,
        /^Track$/,
        /^InnerSlider$/
      ]
    });
  }
};
