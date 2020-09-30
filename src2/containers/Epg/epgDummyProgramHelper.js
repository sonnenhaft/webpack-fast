export const populateEmptyChannels = ({
  data = [],
  endTime,
  epgNoProgramInfo,
  startTime
}) =>
  data.map(({ id, isOttUnicast, programs = [], ...rest }) => {
    if (!programs?.length) {
      return {
        id,
        isOttUnicast,
        programs: [
          {
            channel: {
              id,
              isOttUnicast
            },
            endTime,
            id,
            startTime,
            title: epgNoProgramInfo
          }
        ],
        ...rest
      };
    }

    return {
      id,
      isOttUnicast,
      programs,
      ...rest
    };
  });
