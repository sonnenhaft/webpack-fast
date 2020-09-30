import { useEffect, useState } from 'react';
import cookie from 'react-cookie';
import { getUrl } from '#/services/graphql';
import {
  useQueryWithVariables,
  useLazyQuery
} from '#/services/graphql/useUncachedQuery';
import OAUTH_LOGIN_URL from '#/services/auth/oauthLoginURL.graphql';
import OAUTH_LOGOUT_URL from '#/services/auth/oauthLogoutURL.graphql';

const state = Math.round(1000000 * Math.random());

export function getRedirectUri() {
  if (!cookie.load('loginstate')) {
    cookie.save('loginstate', `a${state}`, { maxAge: 60 });
  }

  return `${getUrl()}auth_complete?state=${
    window.location.origin
  }/login?state=${cookie.load('loginstate')}`;
}

export const useOAuthLogin = ({ code, error }) => {
  const [fetchOauthLoginUrl, { data: { oauthLogin } = {} }] = useLazyQuery({
    gql: OAUTH_LOGIN_URL
  });
  const { data: { oauthLogoutURL } = {} } = useQueryWithVariables({
    gql: OAUTH_LOGOUT_URL
  });

  const [modalUrl, setModalUrl] = useState('');
  useEffect(() => setModalUrl(oauthLogin), [oauthLogin]);

  useEffect(() => {
    if (modalUrl && (!code || (error && oauthLogoutURL))) {
      cookie.remove('loginstate');
      const oauthLoginUrl = modalUrl?.replace(
        /(redirect_uri=).*(auth_complete)/g,
        `$1${getRedirectUri()}`
      );
      window.location = error
        ? `${oauthLogoutURL}?redirect_uri=${encodeURIComponent(oauthLoginUrl)}`
        : oauthLoginUrl;
    }
  }, [modalUrl, error]);

  return {
    getOauthLoginCode: fetchOauthLoginUrl
  };
};

export const useOAuthLogout = (
  redirectUri = `${window.location.origin}/home`
) => {
  const [fetchOauthLogoutUrl, { data: { oauthLogoutURL } = {} }] = useLazyQuery(
    {
      gql: OAUTH_LOGOUT_URL
    }
  );

  const [modalUrl, setModalUrl] = useState('');
  useEffect(() => setModalUrl(oauthLogoutURL), [oauthLogoutURL]);

  useEffect(() => {
    if (modalUrl) {
      window.location = `${modalUrl}?redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;
    }
  }, [modalUrl, redirectUri]);

  return {
    getOauthLogoutUrl: fetchOauthLogoutUrl
  };
};
