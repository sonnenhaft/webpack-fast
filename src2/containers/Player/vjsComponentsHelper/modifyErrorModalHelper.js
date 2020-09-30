import {
  PLAYBACK_UNAUTHORIZED_CODE,
  PLAYER_ACTION,
  VJS_CUSTOM_CLASSNAMES,
  VJS_CUSTOM_COMPONENTS
} from '#/constants';
import { getErrorCodeAndMessage, getParsedObject, noop } from '#/helpers';

const {
  BACK_BUTTON,
  ERROR_PROMPT,
  ERROR_PROMPT_BUTTON
} = VJS_CUSTOM_COMPONENTS;
const { errorPromptMessage, errorPromptTitle } = VJS_CUSTOM_CLASSNAMES;
const { nextEpisode, prevEpisode } = PLAYER_ACTION;

const replacingErrorMsgHelper = ({
  errorCode,
  errorMessage,
  messages = {},
  playerErrors = {},
  playerInstance = {}
}) => {
  playerInstance.errorDisplay.removeClass(VJS_CUSTOM_CLASSNAMES.hiddenClass);
  const { playerErrorTitle } = messages;
  const playerError =
    playerErrors[`WEB_PLAYER_${errorCode}`] || playerErrors[errorCode] || {};
  const {
    errorCode: playerErrorCode,
    errorMessage: playerErrorMessage
  } = playerError;
  const errorMessageText =
    playerErrorMessage ||
    errorMessage ||
    playerErrors.WEB_PLAYER_DEFAULT?.errorMessage;
  const code = playerErrorCode || errorCode;
  const errorCodeText = code ? `[${code}]` : '';

  const errorDisplayContent = playerInstance.errorDisplay.contentEl_;
  const errorModalTitle = `<h4>${playerErrorTitle}</h4>`;
  errorDisplayContent.innerHTML = `${errorModalTitle}<span>${errorCodeText} ${errorMessageText}<span>`;
};

export const modifyErrorModal = ({ playerInstance = {}, ...data }) => {
  const { code: errorCode } = playerInstance.error();
  replacingErrorMsgHelper({
    ...data,
    errorCode,
    playerInstance
  });
};

export const customErrorHandling = ({
  dispatchPlayerAction = noop,
  messages = {},
  nagraContentTokenError,
  playerInstance = {},
  playerState = {},
  ssmSetupError,
  streamUrl
}) => {
  const {
    cancelText,
    errorPlayerContentToken,
    errorPlayerOtherMsg,
    errorPlayerSessionLimit,
    errorPlayerURLMissing,
    playerEntitlementError,
    playerNextEps,
    playerPreviousEps
  } = messages;
  const { uri } = streamUrl || {};
  const { currentEpisodeIndex, maxEpisodeIndex, type } = playerState || {};

  const exitPlayer = () =>
    playerInstance.getChild(BACK_BUTTON)?.trigger('click');

  const changeToNextEpisode = () =>
    dispatchPlayerAction({ type: PLAYER_ACTION.nextEpisode });
  const changeToPrevEpisode = () =>
    dispatchPlayerAction({ type: PLAYER_ACTION.prevEpisode });

  const getChangeEpisode = ({ type: playerAction, isButton = false }) => {
    switch (playerAction) {
      case nextEpisode:
        return isButton ? changeToNextEpisode : playerNextEps;

      case prevEpisode:
        return isButton ? changeToPrevEpisode : playerPreviousEps;

      default:
        return isButton ? changeToNextEpisode : playerNextEps;
    }
  };

  const isEndOfSeries =
    (currentEpisodeIndex === 0 && type === prevEpisode) ||
    (currentEpisodeIndex === maxEpisodeIndex && type === nextEpisode);

  if (playerInstance) {
    if (nagraContentTokenError) {
      const { code } = getErrorCodeAndMessage(nagraContentTokenError) || {};
      if (code === PLAYBACK_UNAUTHORIZED_CODE) {
        const errorPrompt = playerInstance.getChild(ERROR_PROMPT);
        if (errorPrompt) {
          playerInstance.removeChild(ERROR_PROMPT);
        }

        const newErrorPrompt = playerInstance.addChild(ERROR_PROMPT, [
          {
            className: errorPromptTitle,
            text: errorPlayerOtherMsg
          },
          {
            className: errorPromptMessage,
            text: playerEntitlementError
          }
        ]);
        const errorPromptButtonList = [
          {
            buttonFunction: isEndOfSeries
              ? exitPlayer
              : getChangeEpisode({ type, isButton: true }),
            text: getChangeEpisode({ type, isButton: false })
          },
          {
            buttonFunction: exitPlayer,
            text: cancelText
          }
        ];
        errorPromptButtonList.forEach(button =>
          newErrorPrompt.addChild(ERROR_PROMPT_BUTTON, button)
        );

        return;
      }

      replacingErrorMsgHelper({
        errorCode: '101',
        errorMessage: errorPlayerContentToken,
        messages,
        playerInstance
      });
    } else if (!uri && streamUrl) {
      replacingErrorMsgHelper({
        errorCode: '102',
        errorMessage: errorPlayerURLMissing,
        messages,
        playerInstance
      });
    } else if (ssmSetupError) {
      const { reason: { message } = {} } = ssmSetupError || {};
      const { errorCode } = getParsedObject(message);
      replacingErrorMsgHelper({
        errorCode,
        errorMessage: errorPlayerSessionLimit,
        messages,
        playerInstance
      });
    } else {
      const playerErrorDisplay = playerInstance?.errorDisplay;
      const errorDisplayContent = playerErrorDisplay.contentEl_;
      errorDisplayContent.innerHTML = '';
      playerErrorDisplay.hide();
    }
  }
};
