import React, { Fragment, useContext, useEffect, useState } from 'react';
import cookie from 'react-cookie';
import PropTypes from 'prop-types';

import { AuthContext, ConfigContext } from '#/utils/context';
import TermsAndConditions from '#/containers/TermsAndConditions/TermsAndConditionsContainer';
import Spinner from '#/components/Spinner/Spinner';
import { useHistory, useLocation } from 'react-router';
import {
  addToEssoIdOrTvIdMap,
  formatError,
  prepareTokens,
  useLogin,
  useLoginWithClientId,
  useSecondLogin
} from './useLoginHook';
import {
  isClientIdDeletedCheck,
  isDeviceLimitReachedCheck
} from './errorCodeCheck';

import { AUTH_ACTIONS, ESSOID_OR_TVID_MAP, EXT_ROUTES } from '#/constants';

import { getStorageValue, numOfKeys } from '#/helpers';
import logo from '#/static/images/logo.png';
import PageFooter from '#/components/PageFooter/PageFooter';

import LoginButton from './LoginButton';
import ProfileSelector from './ProfileSelector';

import styles from './login.scss';

import loginBlurBackgroundSrc from '#/static/images/login-background@3x.png';
import { useOAuthLogin } from '#/views/LoginPage/useOauthUfinityModal';

const INCORRECT_ERROR = 'signinIncorrectIDPWError';

const blurBackgroundStyle = {
  backgroundImage: `url(${loginBlurBackgroundSrc})`
};

export const LoginSection = ({ noPadding = false }) => {
  const history = useHistory();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [inputComplete, setInputComplete] = useState(false);
  const showSignUpSection = !loading && !inputComplete;
  const {
    messages,
    signUpAndForgotCredentials: { signUpUrl } = {}
  } = useContext(ConfigContext);
  const { signupNowQuestion, signupNowText } = messages;

  const onComplete = () => {
    if (!inputComplete) {
      setInputComplete(true);
    }
  };
  const { dispatch } = useContext(AuthContext);
  const {
    loginScreenTitle_web: loginScreenTitle,
    loginOauthLoginButtonTitle,
    okIGotIt,
    termsAndConditionLoginDescriptionText
  } = messages;

  const searchParams = new URLSearchParams(location.search);
  const [essoIdOrTvIdMap, setEssoIdOrTvIdMap] = useState({});
  const [errorFromState, setError] = useState(null);
  const [tvIdSelectedFromState, setTvIdSelectedState] = useState(null);
  const [{ code, state }, setCodeAndState] = useState({
    code: searchParams.get('code'),
    state: searchParams.get('state')
  });
  const clearCode = () => {
    setCodeAndState({});
    cookie.remove('loginstate');
  };
  const {
    ufinityLoginData,
    isLoginComplete,
    login,
    loginError,
    tokens
  } = useLogin(clearCode, code, state);

  const { getOauthLoginCode } = useOAuthLogin({ code, error: loginError });

  const cameFromOtherButton = location.search?.includes('activated');

  useState(() => {
    if (!code && cameFromOtherButton) {
      getOauthLoginCode();
    }
  }, [cameFromOtherButton, code]);

  useEffect(() => {
    if (code && !loading) {
      login();
    }
  }, [code, loading]);

  const { essoId, tvId } = ufinityLoginData;
  const [secondLogin, nagraToken, nagraLoginError] = useSecondLogin({
    ...ufinityLoginData,
    tvIdSelectedFromState
  });
  const [reLogin, clientIdToken, nagraClientError] = useLoginWithClientId(
    ufinityLoginData,
    essoIdOrTvIdMap
  );
  const error = errorFromState || loginError || nagraClientError;
  const { message: errorMessage } = error || {};
  const profileSelectorErrorCheck =
    Boolean(numOfKeys(ufinityLoginData)) && !errorFromState;

  const [essoIdOrTvId, setEssoIdOrTvId] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  if ((loading && isLoginComplete) || errorFromState || nagraClientError) {
    setLoading(false);
  }

  const onProfileSelected = ({ id: tvIdSelected }) => {
    setLoading(true);
    setTvIdSelectedState(tvIdSelected);
    if (tvIdSelected) {
      const clientId = essoIdOrTvIdMap?.[tvIdSelected];
      setEssoIdOrTvId(tvIdSelected);

      if (clientId) {
        reLogin({
          variables: {
            clientId,
            essoIdOrTvId: tvIdSelected
          }
        });
        setIsFirstLogin(false);

        return;
      }

      secondLogin({
        variables: {
          essoIdOrTvId: tvIdSelected
        }
      });
    }
  };

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [code]);

  useEffect(() => {
    const useSetStateForTvIdMap = async () => {
      const essoIdOrTvIdMapFromStore = await getStorageValue(
        ESSOID_OR_TVID_MAP
      );
      setEssoIdOrTvIdMap(essoIdOrTvIdMapFromStore);
    };
    useSetStateForTvIdMap();
  }, []);

  // check if device limit reached
  useEffect(() => {
    if (nagraLoginError) {
      const actualError = formatError(nagraLoginError);
      setError(
        isDeviceLimitReachedCheck(nagraLoginError)
          ? actualError
          : {
              message: messages[INCORRECT_ERROR]
            }
      );
    }
  }, [nagraLoginError]);

  // check if clientId is deleted
  useEffect(() => {
    if (isClientIdDeletedCheck(nagraClientError)) {
      secondLogin({
        variables: {
          essoIdOrTvId: tvIdSelectedFromState
        }
      });
    }
  }, [nagraClientError]);

  useEffect(() => {
    const tokensAfterProfileSelector = prepareTokens(
      nagraToken,
      clientIdToken,
      ufinityLoginData,
      ''
    );

    if (tokens || tokensAfterProfileSelector) {
      const [singleTvId] = tvId || [];
      onComplete();

      if (isFirstLogin && tokensAfterProfileSelector) {
        addToEssoIdOrTvIdMap({ [essoIdOrTvId]: nagraToken?.clientId });
      }

      dispatch({
        type: AUTH_ACTIONS.LOGIN,
        tokens: {
          ...(tokens || tokensAfterProfileSelector),
          currentProfile: essoIdOrTvId || singleTvId?.id?.trim() || essoId
        }
      });

      if (history?.action === 'PUSH') {
        history.goBack();

        return;
      }

      history.push('/');
    }
  }, [clientIdToken, essoIdOrTvId, nagraToken, tokens]);

  if (tvId?.length > 1 && profileSelectorErrorCheck) {
    return (
      <ProfileSelector
        messages={messages}
        profiles={tvId}
        onButtonClick={onProfileSelected}
      />
    );
  }

  const showLoginError = Boolean(error?.message) || Boolean(error?.messages);

  return (
    <Fragment>
      <div className={noPadding ? null : styles.loginCard}>
        <Fragment>
          {loading ? (
            <Spinner className={styles.loginSpinner} />
          ) : (
            <Fragment>
              {showLoginError && (
                <div className={styles.loginErrorText}>
                  {errorMessage} <br />
                </div>
              )}

              <LoginButton
                onClick={getOauthLoginCode}
                disabled={!!code}
                text={loginOauthLoginButtonTitle || loginScreenTitle}
              />
            </Fragment>
          )}
        </Fragment>

        <TermsAndConditions
          acknowledgeText={okIGotIt}
          declarationText={termsAndConditionLoginDescriptionText}
          textStyle={styles.termsAndConditions}
        />
      </div>

      {showSignUpSection && (
        <div
          className={noPadding ? styles.signupCardNoPadding : styles.signupCard}
        >
          {signupNowQuestion}
          <a href={signUpUrl || EXT_ROUTES.SIGN_UP}>{signupNowText}</a>
        </div>
      )}
    </Fragment>
  );
};

LoginSection.propTypes = {
  noPadding: PropTypes.bool
};

export default () => (
  <div className={styles.loginContainer}>
    <div className={styles.loginBlurBackground} style={blurBackgroundStyle} />
    <img src={logo} className={styles.loginLogo} alt="Starhub" />

    <div className={styles.loginCardsContainer}>
      <LoginSection />
    </div>
    <PageFooter />
  </div>
);
