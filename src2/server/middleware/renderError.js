const getClientErrorMessage = () => {
  return `
    <html>
    <head><style> h1 { margin: 20px; } </style></head>
      <body>
        <h1>Error 503: <small>Service Unavailable</small></h1>
      </body>
    </html>
  `;
};

// NOTE: the 4th param is required (even if unused) in order for Express to use this as an error-handler.
// eslint-disable-next-line no-unused-vars
const renderError = (err, req, res, next /* NOSONAR */) => {
  if (err.isStatusError) {
    return;
  }
  res.status(503).send(getClientErrorMessage());
};

export default renderError;
