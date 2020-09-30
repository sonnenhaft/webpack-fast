import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  useEpgAssetDetails,
  useRetrieveEpg,
  useRetrieveFilteredEpg
} from '#/services/epg';
import { EpgContext } from '#/utils/context';

import Spinner from '#/components/Spinner/Spinner';
import CustomChannelCell from './CustomChannelCell';
import CustomCurrentTimeMarker from './CustomCurrentTimeMarker';
import CustomNavigationButton from './CustomNavigationButton';
import CustomProgram from './CustomProgram';
import EpgFilterButtons from './EpgFilterButtons';
import { populateEmptyChannels } from './epgDummyProgramHelper';

import { showParentalCheckHelper } from '#/views/CommonDetailsPage/usePinHook';
import {
  getEpgQueryEndStartDate,
  ONE_HOUR_IN_MS,
  ONE_DAY_IN_MS
} from '#/helpers/timeHelpers';

import {
  bodyWidth,
  headerHeight,
  leftColumnWidth,
  programHeight
} from './epgDimensions';

import {
  channelCell,
  channelColumn,
  channelNameContainer,
  clicked,
  clickedBorder,
  epgContainer,
  fibreActive,
  fibreLabel,
  iconContainer,
  iconStyle,
  innerChannelCell,
  innerContainer,
  innerProgramContainer,
  programGuide,
  timeCell,
  timelineContainer,
  timeText,
  titleText,
  topButtonsContainer
} from './epgContainer.scss';

import { EPG_PLAYER_ACTION } from '#/constants';
import { ProgramGuideWithStickyTimeline } from '#/containers/Epg/ProgramGuideWithStickyTimeline';

const { unloadPlayer } = EPG_PLAYER_ACTION;

const EpgContainer = ({
  epgCategories,
  epgPlayerDispatch,
  messages = {},
  parentalSettingsData = {},
  restrictedChannels = []
}) => {
  const {
    programSelected,
    setProgramSelected,
    setProgramSelectedInfo
  } = useContext(EpgContext);
  const { channelId: selectedChannelId } = programSelected || {};

  const {
    epgGoToNowButtoTitle,
    epgNoProgramInfo,
    filterShowing_web: filterShowingText,
    nowText,
    todayText
  } = messages;
  const {
    loading,
    data: { nagraEpg: { items = [] } = {} } = {}
  } = useRetrieveEpg();

  const [
    lazyloadFilteredData,
    {
      loading: filteredItemsLoading,
      data: { nagraEpg: { items: filteredItems } = {} } = {}
    }
  ] = useRetrieveFilteredEpg();
  const [
    lazyloadEpgDetails,
    { data: epgDetailsData = {} }
  ] = useEpgAssetDetails();
  const { details: selectedProgramDetails } = epgDetailsData || {};
  const { next: nextProgram } = selectedProgramDetails || {};
  const { rating } = nextProgram || {};
  const showParentalCheckForNextProgram = showParentalCheckHelper({
    id: selectedChannelId,
    isLinearDetails: true,
    parentalSettingsData,
    rating,
    restrictedChannels
  });
  const modifiedSelectedProgramDetails = {
    ...selectedProgramDetails,
    next: {
      ...nextProgram,
      showParentalCheck: showParentalCheckForNextProgram
    }
  };

  const [epgData, setEpgData] = useState(null);

  const [displayStartTime, setDisplayStartTime] = useState(
    Date.now() - ONE_HOUR_IN_MS
  );
  const initialStartTime = new Date().setMinutes(0, 0, 0) - ONE_DAY_IN_MS;
  const initialEndTime = new Date().setMinutes(0, 0, 0) + ONE_DAY_IN_MS;
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const [navigateCount, setNavigateCount] = useState(0);

  const [dateFilterIndex, setDateFilterIndex] = useState(1);
  const [dateLabel, setDateLabel] = useState(todayText);
  const [selectedCategory, setSelectedCategory] = useState('');

  const epgQueryEndStartDate = getEpgQueryEndStartDate();
  const navigateNow = () => {
    setNavigateCount(navigateCount + 1);
    lazyloadFilteredData({
      variables: {
        dateFrom: epgQueryEndStartDate[0],
        dateTo: epgQueryEndStartDate[1]
      }
    });
    setDisplayStartTime(Date.now() - ONE_HOUR_IN_MS);
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
    setDateFilterIndex(1);
    setDateLabel(todayText);
  };
  const onClickProgram = (selectedProgram, { id: channelId }) => {
    if (
      !selectedProgram?.startOverSupport &&
      selectedProgram?.endTime < Date.now()
    ) {
      return;
    }
    setProgramSelected({
      programId: selectedProgram.id,
      channelId
    });
    epgPlayerDispatch({ type: unloadPlayer });
    lazyloadEpgDetails({
      variables: {
        id: selectedProgram.id
      }
    });
  };

  useEffect(() => {
    if (!filteredItemsLoading) {
      setEpgData(filteredItems);
      setNavigateCount(navigateCount + 1);
    }
  }, [filteredItems]);

  useEffect(() => {
    if (selectedProgramDetails) {
      setProgramSelectedInfo(modifiedSelectedProgramDetails);
    }
  }, [selectedProgramDetails]);

  if (loading) {
    return <Spinner />;
  }

  const dataFromQuery = selectedCategory ? epgData : items;
  const data = populateEmptyChannels({
    data: dataFromQuery,
    endTime,
    epgNoProgramInfo,
    startTime
  });
  const entriesCount = data?.length;

  const programGuideStyles = {
    programGuide,
    timelineContainer,
    channelNameContainer
  };

  const components = {
    CurrentTimeMarker: CustomCurrentTimeMarker,
    NavigationButton: CustomNavigationButton,
    Program: CustomProgram
  };
  const componentsProps = {
    Program: {
      style: {
        height: '64px'
      },
      theme: {
        clicked,
        iconContainer,
        iconStyle,
        innerContainer,
        innerProgramContainer,
        timeText,
        titleText
      }
    },
    ChannelColumn: {
      theme: {
        channelColumn
      },
      components: {
        ChannelCell: CustomChannelCell
      }
    },
    ChannelCell: {
      height: 64,
      theme: {
        channelCell,
        clickedBorder,
        fibreActive,
        fibreLabel,
        innerChannelCell
      }
    },
    Timeline: {
      height: 40,
      componentsProps: {
        TimeCell: {
          theme: {
            timeCell
          }
        }
      }
    },
    CurrentTimeMarker: {
      epgGoToNowButtoTitle,
      navigateNow,
      nowText
    }
  };

  const onGetTvListings = ({ endTime: pEndTime, startTime: pStartTime }) =>
    Promise.resolve({
      entries: data.map(({ programs, ...channelProps }) => ({
        ...channelProps,
        programs: programs.filter(
          program =>
            program?.startTime < pEndTime && program?.endTime > pStartTime
        )
      }))
    });

  return (
    <div className={epgContainer}>
      <div className={topButtonsContainer}>
        {
          <EpgFilterButtons
            dateFilterIndex={dateFilterIndex}
            dateLabel={dateLabel}
            epgCategories={epgCategories}
            filterShowingText={filterShowingText}
            lazyloadFilteredData={lazyloadFilteredData}
            messages={messages}
            selectedCategory={selectedCategory}
            setDateFilterIndex={setDateFilterIndex}
            setDateLabel={setDateLabel}
            setDisplayStartTime={setDisplayStartTime}
            setEndTime={setEndTime}
            setSelectedCategoryForQuery={setSelectedCategory}
            setStartTime={setStartTime}
          />
        }
      </div>
      <ProgramGuideWithStickyTimeline
        bodyWidth={bodyWidth}
        channelDisplayCount={entriesCount}
        components={components}
        componentsProps={componentsProps}
        displayStartTime={displayStartTime}
        headerHeight={headerHeight}
        key={`program-guide-${navigateCount}`}
        leftColumnWidth={leftColumnWidth}
        nrOfChannels={entriesCount}
        onClickProgram={onClickProgram}
        onGetTvListings={onGetTvListings}
        startTime={startTime}
        endTime={endTime}
        theme={programGuideStyles}
        bodyHeight={entriesCount * programHeight}
      />
    </div>
  );
};

EpgContainer.propTypes = {
  epgCategories: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      displayText: PropTypes.string
    })
  ),
  epgPlayerDispatch: PropTypes.func,
  messages: PropTypes.object,
  parentalSettingsData: PropTypes.object,
  restrictedChannels: PropTypes.array
};

export default EpgContainer;
