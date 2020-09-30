import moment from 'moment-mini';

const MOMENT_TIME_ONLY_FORMAT = 'HH:mm';
const MOMENT_DATE_ONLY_FORMAT = 'D MMM YYYY';
const EPG_DISPLAYED_DATE_FILTER_FORMAT = 'MMM D, YYYY';
const EPG_QUERY_DATE_FORMAT = 'YYYY-MM-DD';
const EPG_DATE_DIFF = [-1, ...Array(7).keys()];
export const ONE_HOUR_IN_SEC = 60 * 60;
export const ONE_HOUR_IN_MS = ONE_HOUR_IN_SEC * 1000;
export const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;

const dateDiffFn = ({ dateDiff, dateFormat }) => {
  const today = moment();

  return today.add(dateDiff, 'days').format(dateFormat);
};

export const unixToLocalTimeWithTimeOnly = unixTime =>
  `${moment.unix(unixTime).format(MOMENT_TIME_ONLY_FORMAT)}`;

export const unixMsToLocalTimeWithTimeOnly = unixTime =>
  `${moment(unixTime).format(MOMENT_TIME_ONLY_FORMAT)}`;

export const unixMsToLocalTimeWithDateOnly = unixTime =>
  `${moment(unixTime).format(MOMENT_DATE_ONLY_FORMAT)}`;

export const getEpgDisplayedDateRange = () =>
  EPG_DATE_DIFF.map(dateDiff =>
    dateDiffFn({ dateDiff, dateFormat: EPG_DISPLAYED_DATE_FILTER_FORMAT })
  );

export const getEpgQueryDateRange = () =>
  EPG_DATE_DIFF.map(dateDiff =>
    dateDiffFn({ dateDiff, dateFormat: EPG_QUERY_DATE_FORMAT })
  );

export const getEpgUnixDateRange = () => {
  const dateRange = EPG_DATE_DIFF.map((dateDiff, index) => {
    if (index === 0) {
      return new Date().setSeconds(0, 0, 0, 0) - ONE_DAY_IN_MS;
    }
    const today = new Date().setHours(0, 0, 0, 0);

    return today + dateDiff * ONE_DAY_IN_MS;
  });

  return dateRange;
};

export const getEpgQueryEndStartDate = () => {
  const startDate = dateDiffFn({
    dateDiff: -1,
    dateFormat: EPG_QUERY_DATE_FORMAT
  });
  const endDate = dateDiffFn({
    dateDiff: 1,
    dateFormat: EPG_QUERY_DATE_FORMAT
  });

  return [startDate, endDate];
};

export const getTimeshiftFormatTime = unixTime => {
  if (unixTime) {
    const timeShiftFormatString = new Date(unixTime)
      .toISOString()
      .replace(/[-:.Z]/g, '');

    return timeShiftFormatString.slice(0, -3);
  }
};

export const isLiveHelper = ({ end, start }) =>
  Date.now() > start && Date.now() < end;
