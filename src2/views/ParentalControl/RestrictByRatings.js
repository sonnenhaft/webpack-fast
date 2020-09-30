import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';

import { ConfigContext } from '#/utils/context';
import { RadioButton } from '#/components/Input';

import Modal from '#/components/Modal/Modal';
import Button from '#/components/Button/Button';
import Subsection from '#/components/SubSection/SubSection';
import Spinner from '#/components/Spinner/Spinner';

import { useAddParentalRating, useParentalRating } from '#/services/settings';
import { RATINGS, ROUTE } from '#/constants';

import { noop, isFalse, clearRouteState } from '#/helpers';

import {
  SAVE_CHANGES,
  SUCCESSFUL,
  ERROR,
  RATING_CHANGE_ERROR,
  RATING_CHANGE_SUCCESS,
  TRY_AGAIN,
  OK_I_GOT_IT
} from './constants';

import {
  restrictHeader,
  restrictSaveChangesButton,
  ratingItem,
  ratingR21Item,
  ratingTitle,
  restrictSubsection,
  restrictSubsectionSeperator,
  ratingOptionContainer,
  ratingRadioButton,
  ratingRadioSelected,
  ratingsContainer,
  loadingSpinner
} from './parental-control.scss';

const RESTRICT_BY_RATINGS = 'parentalRestrictContentRating';
const MAX_CONTENT_WITHOUT = 'parentalRestrictRatingText';

const M18 = RATINGS[1];

const ratingList = RATINGS.map(title => ({
  title,
  desc: `parental${title.toUpperCase()}Description`
}));

const RatingItem = ({
  className,
  title,
  desc,
  selected,
  onSelect = noop,
  r21 = false
}) => {
  const { messages } = useContext(ConfigContext);

  const getMessage = key => messages[key] || '';

  return (
    <div className={classnames(ratingItem, className)}>
      <span className={ratingTitle}>{getMessage(title)}</span>
      <div className={ratingOptionContainer}>
        <span>{getMessage(desc)}</span>
        {!r21 && (
          <RadioButton
            checked={selected}
            onChange={onSelect}
            className={ratingRadioButton}
            selectedClassName={ratingRadioSelected}
          />
        )}
      </div>
    </div>
  );
};

const RestrictByRatings = ({ history }) => {
  const { location: { state: { isAuthenticated } = {} } = {} } = history || {};
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState(false);
  const { messages, ratingWeights } = useContext(ConfigContext);
  const loadingRef = useRef(null);
  const [isPristine, setIsPristine] = useState(true);
  const [rating, setRating] = useState('');
  const [redirectToSettings, setRedirectToSettings] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const { data: { parentalPin } = {}, loading, refetch } = useParentalRating();

  const {
    isEnabled,
    rating: parentalRating,
    settings: { restrictContentByPin } = {}
  } = parentalPin || {};

  const [
    addRating,
    { error, loading: addRatingLoading }
  ] = useAddParentalRating();

  const getMessage = key => messages[key] || '';

  const [r21Item, ...ratings] = ratingList;

  const initialRating = parentalRating?.toLowerCase() || M18;

  const selectedIndex = ratings.findIndex(
    ({ title }) => initialRating === title
  );

  const initialSelectedIndex = isPristine && selectedIndex;

  const selectedStates = ratings.map(() => {
    const [selected, setSelected] = useState(false);

    return { selected, setSelected };
  });

  const onSelect = index =>
    selectedStates.forEach(({ setSelected }, idx) => {
      setRating(ratings[index]?.title);
      setSelected(index === idx);
    });

  const backToMainParentalSettings = () =>
    history.push(ROUTE.PARENTAL_CONTROLS, { fromRestrictPage: true });

  useEffect(() => {
    if (loadingRef.current && !addRatingLoading) {
      setModalProps({
        title: error ? ERROR : SUCCESSFUL,
        subtitle: error ? RATING_CHANGE_ERROR : RATING_CHANGE_SUCCESS,
        buttonProps: [
          {
            displayText: error ? TRY_AGAIN : OK_I_GOT_IT,
            onClick: backToMainParentalSettings
          }
        ],
        iconType: error ? 'warning' : 'success',
        onModalClose: noop
      });

      toggleModal();
      refetch();
    }

    if (error) {
      onSelect(selectedIndex);
    }

    loadingRef.current = addRatingLoading;
  }, [addRatingLoading]);

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectToSettings(true);
    }
    clearRouteState(ROUTE.RESTRICT_BY_RATINGS);
  }, []);

  if (loading) {
    return <Spinner className={loadingSpinner} />;
  }

  const isLoading = addRatingLoading || loading;

  const disabled = isPristine || rating === initialRating || isLoading;

  const onSaveClick = () => {
    const ratingNumCode = ratingWeights?.[rating?.toUpperCase()] || 0;

    addRating({
      variables: {
        ratingCode: ratingNumCode.toString()
      }
    });
  };

  const buttonProps = {
    [disabled ? 'white' : 'light']: true,
    onClick: onSaveClick,
    disabled
  };

  if (
    isFalse(isEnabled) ||
    isFalse(restrictContentByPin) ||
    redirectToSettings
  ) {
    return <Redirect to={ROUTE.PARENTAL_CONTROLS} />;
  }

  return (
    <Fragment>
      <div className={restrictHeader}>
        <h1>{getMessage(RESTRICT_BY_RATINGS)}</h1>
        <Button
          {...buttonProps}
          className={restrictSaveChangesButton}
          displayText={getMessage(SAVE_CHANGES)}
        />
      </div>
      <Subsection
        noSubtitle
        title={MAX_CONTENT_WITHOUT}
        className={restrictSubsection}
        seperatorClassName={restrictSubsectionSeperator}
      >
        <RatingItem r21 className={ratingR21Item} {...r21Item} />
      </Subsection>
      <Subsection
        noSubtitle
        className={restrictSubsection}
        seperatorClassName={restrictSubsectionSeperator}
      >
        <div className={ratingsContainer}>
          {ratings.map((ratingData, idx) => (
            <RatingItem
              key={`rating-${idx}`}
              {...ratingData}
              selected={
                selectedStates[idx]?.selected || idx === initialSelectedIndex
              }
              onSelect={() => {
                onSelect(idx);

                if (isPristine) {
                  setIsPristine(false);
                }
              }}
            />
          ))}
        </div>
      </Subsection>
      {showModal && modalProps && (
        <Modal
          {...modalProps}
          showModal={showModal}
          toggleModal={toggleModal}
        />
      )}
    </Fragment>
  );
};

RestrictByRatings.propTypes = { history: PropTypes.object };

RatingItem.propTypes = {
  className: PropTypes.string,
  desc: PropTypes.string,
  onSelect: PropTypes.func,
  r21: PropTypes.bool,
  selected: PropTypes.bool,
  title: PropTypes.string
};

export default RestrictByRatings;
