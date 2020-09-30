import accedoOneMiddleware from '@accedo/accedo-one-express';
import useragent from 'useragent';
import { getAccedoOneSessionKeyForWebcrawler } from './getAccedoOneConfig';

import accedoOne, {
  HTTP_ONLY,
  SECURE_FLAG,
  SESSION_KEY,
  SIXTY_YEARS_IN_MS
} from '#/config/accedoOne';
import logger from '#/utils/logger';

const isSessionKeyExpired = expiration => {
  if (expiration) {
    const [date, time] = expiration.split('T') || [];
    const year = date.substr(0, 4);
    const month = date.substr(4, 2);
    const day = date.substr(6, 2);

    const [hour, minute, second] = time.split(/:|\+/) || [];
    const sessionKeyUnixTime = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour) + 8,
      Number(minute),
      Number(second)
    );

    return sessionKeyUnixTime < new Date();
  }
};

const accedoOneMiddlewareWrapper = () => {
  return async (req, res, next) => {
    const userAgentHeader = req.headers['user-agent'];
    const agent = useragent.parse(userAgentHeader);
    const { family } = agent.device.toJSON() || {};
    const isGenericSessionUsed =
      family === 'Spider' ||
      userAgentHeader.indexOf('ELB-HealthChecker') !== -1 ||
      userAgentHeader.indexOf('MetaInspector') !== -1;

    if (isGenericSessionUsed) {
      let crawlerSessionKey;
      const { expiration: crawlerSessionKeyExpiration, sessionKey } =
        req.app.locals.crawlerSession || {};
      crawlerSessionKey = sessionKey;

      if (
        !crawlerSessionKey ||
        isSessionKeyExpired(crawlerSessionKeyExpiration)
      ) {
        const crawlerSession = await getAccedoOneSessionKeyForWebcrawler();
        const { sessionKey: newSessionKey } = crawlerSession;
        req.app.locals.crawlerSession = crawlerSession;
        crawlerSessionKey = newSessionKey;
      }

      res.cookie(SESSION_KEY, crawlerSessionKey, {
        httpOnly: HTTP_ONLY,
        maxAge: SIXTY_YEARS_IN_MS,
        secure: SECURE_FLAG
      });

      next();
    } else {
      accedoOneMiddleware(accedoOne)(req, res, next);
    }

    logger.info({
      userAgentHeader
    });
  };
};

export default accedoOneMiddlewareWrapper;
