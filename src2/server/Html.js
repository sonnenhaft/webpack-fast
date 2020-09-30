import React from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

const getHtmlInfo = ({ component, store }) => {
  try {
    const content = component ? ReactDOMServer.renderToString(component) : '';
    const serializedData = serialize(store.getState());

    return {
      isSSR: !!component,

      content,
      serializedData
    };
  } catch (e) {
    console.warn('There was an error while rendering the app', e);

    return {
      content: '',
      isSSR: false,
      serializedData: 'undefined'
    };
  }
};

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 *
 * @returns {Html} Renderable HTML
 */
const Html = ({ assets, component, metaTags, newRelicScript, store }) => {
  const { serializedData, content, isSSR } = getHtmlInfo({ component, store });
  const head = Helmet.renderStatic();
  const { NAGRA_SDK_CSS, NAGRA_SDK_JS } = __ENV_CONFIG__;
  const { description = '', displayText = '', image = '', keywords = '' } =
    metaTags || {};
  const imageWithCappedWidth = image ? `${image}?w=200` : '';

  return (
    <html lang="en-US">
      <head>
        {head.base.toComponent()}

        <title>{displayText}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={displayText} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageWithCappedWidth} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image:src" content={image} />

        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}

        {/* eslint-disable react/no-danger */}
        <script
          dangerouslySetInnerHTML={{ __html: newRelicScript }}
          charSet="UTF-8"
        />
        {/* eslint-enable react/no-danger */}

        <link rel="shortcut icon" href="/favicon.ico" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />

        <link
          href={assets.css.client}
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
        />

        <link rel="stylesheet" href={NAGRA_SDK_CSS} />
        <script src={NAGRA_SDK_JS} type="text/javascript" />
      </head>
      <body>
        {/* eslint-disable react/no-danger */}
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        {store ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__data=${serializedData}; window.__ssr=${!!isSSR};`
            }}
            charSet="UTF-8"
          />
        ) : (
          ''
        )}
        {/* eslint-enable react/no-danger */}

        {assets.js.vendor && <script src={assets.js.vendor} charSet="UTF-8" />}
        <script src={assets.js.client} charSet="UTF-8" />
      </body>
    </html>
  );
};

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  metaTags: PropTypes.shape({
    description: PropTypes.string,
    displayText: PropTypes.string,
    image: PropTypes.string,
    keywords: PropTypes.string
  }),
  newRelicScript: PropTypes.string,
  store: PropTypes.object
};

export default Html;
