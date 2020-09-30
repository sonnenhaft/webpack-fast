import { VJS_CUSTOM_COMPONENTS } from '#/constants';

const { TEXT_LABEL } = VJS_CUSTOM_COMPONENTS;

export const changeTextLabel = ({
  episodeNumberAndTitle,
  linearProgramDuration,
  messages = {},
  playerInstance = {},
  title
}) => {
  const playerDuration = episodeNumberAndTitle
    ? playerInstance.duration()
    : linearProgramDuration;
  const { mins } = messages || {};

  const textLabel = playerInstance.getChild(TEXT_LABEL);

  if (textLabel) {
    playerInstance.removeChild(TEXT_LABEL);

    const minsValue = playerDuration / 60;
    playerInstance.addChild(TEXT_LABEL, {
      ...(episodeNumberAndTitle && { episodeNumberAndTitle }),
      title,
      duration: Number.isNaN(minsValue)
        ? ''
        : `${Math.round(minsValue)} ${mins}`
    });
  }
};
