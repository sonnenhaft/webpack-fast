export const getNewRelicScript = req => {
  const newRelicScript = req.app.locals?.newRelic.getBrowserTimingHeader();

  const scriptTagRegex = /<script type='text\/javascript' >(.*)<\/script>/;
  const newRelicScriptMatch = newRelicScript.match(scriptTagRegex);
  const newRelicScriptWithoutTags = newRelicScriptMatch?.[1];

  return newRelicScriptWithoutTags;
};
