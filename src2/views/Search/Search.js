import React, { useRef, useEffect, useState, Fragment, useMemo } from 'react';
import classnames from 'classnames';
import _isFunction from 'lodash/isFunction';
import orderBy from 'lodash/orderBy';

import PropTypes from 'prop-types';

import Container from '#/containers/Container/Container';
import { SearchMenuIcon, CloseIcon } from '#/components/Icons';
import Spinner from '#/components/Spinner/Spinner';
import { getEntitlement, getParsedObject } from '#/helpers';
import { searchLazyQuery } from '#/services/search';

import { AccedoOneItemAction } from '#/config/templates';

import {
  fadeIn,
  fadeInVisible,
  noResults,
  searchIconContainer,
  searchInputContainer,
  searchInput,
  searchCloseContainer,
  searchCloseIcon,
  searchIcon,
  searchSpinner
} from './search.scss';
import { useDestructureFromAuthContext } from '#/helpers/hooks';
import { AuthContext } from '#/utils/context';

const defaultContainerProps = {
  cardType: '2x3'
};

const { Linear, Vod } = AccedoOneItemAction;

const searchResultToActionMap = {
  content: Vod,
  programme: Linear,
  series: Vod
};

const SEARCH_INPUT_DELAY = 500;

const NoResultsView = ({
  searchNoResultsDescriptionText,
  searchNoResultsText
}) => {
  return (
    <div className={noResults}>
      <h1>{searchNoResultsText}</h1>
      <p>{searchNoResultsDescriptionText}</p>
    </div>
  );
};

const Search = ({ history, messages = {} }) => {
  const { location: { pathname = '', state = {} } = {} } = history || {};
  const { keyword: initialSearchText = '' } = state;

  const inputRef = useRef(null);
  const [isPristine, setIsPristine] = useState(!initialSearchText);
  const [inputValue, setInputValue] = useState(initialSearchText);
  const [keyword, setKeyword] = useState(initialSearchText);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [inputChangeTimer, setInputChangeTimer] = useState(null);
  const [loadSearchQuery, { data = {}, loading }] =
    searchLazyQuery(keyword) || [];

  const { searchTwoDotZero = {} } = data || {};
  const { isNoResultsPage, page } = searchTwoDotZero;
  const { containersData = [] } = page || {};
  const { entitlements = {} } = useDestructureFromAuthContext(AuthContext);

  const closeSearch = () => {
    setHasLoaded(false);

    setTimeout(() => {
      if (history?.action === 'PUSH') {
        history.goBack();

        return;
      }

      history.push('/');
    }, 0);
  };

  const searchWithTimeout = searchString => {
    clearTimeout(inputChangeTimer);
    const timeoutTimer = setTimeout(() => {
      loadSearchQuery(searchString);
      setKeyword(searchString);
    }, SEARCH_INPUT_DELAY);
    setInputChangeTimer(timeoutTimer);
  };

  const onInputChange = ({ target: { value = '' } }) => {
    if (isPristine) {
      setIsPristine(false);
    }

    setInputValue(value);
    history.replace(pathname, { keyword: value });

    if (value?.length >= 3) {
      searchWithTimeout(value);
    }
  };

  useEffect(() => {
    const { current } = inputRef || {};

    setHasLoaded(true);

    if (_isFunction(current?.focus)) {
      current.focus();
    }

    return () => {
      setHasLoaded(false);
      clearTimeout(inputChangeTimer);
    };
  }, []);

  useEffect(() => {
    if (!isPristine && keyword?.length >= 3) {
      searchWithTimeout(keyword);
    }
  }, hasLoaded);

  const processedData = useMemo(() => {
    const entitledFirst = item =>
      getEntitlement({ entitlements, productRefs: item?.productRefs }) ? 1 : 0;

    return containersData.filter(Boolean).map(container => {
      if (!container.rail?.items?.length) {
        return container;
      }

      return {
        ...container,
        rail: {
          ...container.rail,
          items: orderBy(container.rail.items, entitledFirst, 'desc')
        }
      };
    });
  }, [containersData, entitlements]);

  const noSearchResults = !isPristine && isNoResultsPage;
  const mappedContainerData = processedData.map(
    (
      {
        displayText,
        rail = {},
        sourceParams = '{}',
        cardType = defaultContainerProps.cardType
      },
      index
    ) => {
      const { type } = getParsedObject(sourceParams) || {};

      const containerProps = { cardType };

      return (
        <Container
          displayText={displayText}
          action={searchResultToActionMap[type]}
          id={type}
          key={type || `no-result-${index}`}
          rail={rail}
          template="carousel"
          {...containerProps}
        />
      );
    }
  );

  const {
    searchNoResultsDescriptionText,
    searchNoResultsText,
    searchPlaceholderText_web: searchPlaceholderText
  } = messages;

  return (
    <div className={classnames(fadeIn, hasLoaded && fadeInVisible)}>
      <div className={searchInputContainer}>
        <SearchMenuIcon
          className={searchIconContainer}
          iconStyle={searchIcon}
        />
        <input
          value={inputValue}
          ref={inputRef}
          className={searchInput}
          placeholder={searchPlaceholderText}
          onChange={onInputChange}
        />
        <div onClick={closeSearch}>
          <CloseIcon
            className={searchCloseContainer}
            iconStyle={searchCloseIcon}
          />
        </div>
      </div>
      {loading && <Spinner className={searchSpinner} />}
      {!loading && noSearchResults && (
        <Fragment>
          <NoResultsView
            searchNoResultsDescriptionText={searchNoResultsDescriptionText}
            searchNoResultsText={searchNoResultsText}
          />
          {mappedContainerData}
        </Fragment>
      )}
      {!isPristine && !noSearchResults && !loading && mappedContainerData}
    </div>
  );
};

NoResultsView.propTypes = {
  searchNoResultsDescriptionText: PropTypes.string,
  searchNoResultsText: PropTypes.string
};

Search.propTypes = {
  history: PropTypes.object,
  messages: PropTypes.object
};

export default Search;
