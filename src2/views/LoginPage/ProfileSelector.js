import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { RadioButton } from '#/components/Input';
import Spinner from '#/components/Spinner/Spinner';
import { noop } from '#/helpers';

import LoginButton from './LoginButton';

import styles from './login.scss';

const ProfileOption = ({ id, selected, subscriptionIdPrefix, onSelect }) => (
  <div className={styles.selectorOption}>
    <span className={styles.optionText}>{`${subscriptionIdPrefix}${id}`}</span>
    <RadioButton checked={selected} onChange={onSelect} />
  </div>
);

const ProfileSelector = ({
  messages = {},
  profiles = [],
  onButtonClick = noop
}) => {
  const [currentIndex, setCurrentIndex] = useState();
  const checkboxStates = profiles.map(() => useState(false));
  const [loading, setLoading] = useState(false);

  const {
    multipleSubscriptionTitle,
    subscriptionIdPrefix,
    subscriptionSelectionContinueText,
    subscriptionSelectionTitle_web: subscriptionSelectionTitle
  } = messages;

  const onOptionSelect = index =>
    checkboxStates.forEach((_, itemIndex) => {
      const [, setChecked] = checkboxStates[itemIndex];
      if (index !== itemIndex) {
        setChecked(false);
      } else {
        setChecked(true);
        setCurrentIndex(index);
      }
    });
  const onTvIDSelected = () => {
    onButtonClick(profiles[currentIndex]);
    setLoading(true);
  };

  const isButtonDisabled = currentIndex !== 0 && !currentIndex;

  return (
    <div className={styles.profileSelector}>
      {loading ? (
        <Spinner className={styles.loginSpinner} />
      ) : (
        <Fragment>
          <div className={styles.selectorTitle}>
            {multipleSubscriptionTitle}
          </div>
          <div className={styles.selectorSubTitle}>
            {subscriptionSelectionTitle}
          </div>

          <div className={styles.selectorOptionsContainer}>
            {profiles.map((props, index) => {
              const [checked] = checkboxStates[index];

              return (
                <ProfileOption
                  {...props}
                  key={`option-${index}`}
                  selected={checked}
                  subscriptionIdPrefix={subscriptionIdPrefix}
                  optionIndex={index}
                  onSelect={() => onOptionSelect(index)}
                />
              );
            })}
          </div>

          <LoginButton
            className={styles.selectorButton}
            onClick={onTvIDSelected}
            text={subscriptionSelectionContinueText}
            disabled={isButtonDisabled}
          />
        </Fragment>
      )}
    </div>
  );
};

ProfileOption.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.bool,
  subscriptionIdPrefix: PropTypes.string,
  onSelect: PropTypes.func
};

ProfileSelector.propTypes = {
  messages: PropTypes.object,
  onButtonClick: PropTypes.func,
  profiles: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string }))
};

export default ProfileSelector;
