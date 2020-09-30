import React, { useState, useContext } from 'react';
import _isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ConfigContext } from '#/utils/context';

import { WarningSign, SuccessIcon } from '#/components/Icons';
import Button from '#/components/Button/Button';

import OverlayComponent from '../Overlay/OverlayComponent';

import {
  isMounting,
  isUnmounting,
  modalIcon,
  modalIconContainer,
  baseOverlayContainer,
  modalBody,
  modalTitle,
  modalTitleMargin,
  modalSubtitle,
  modalButton,
  modalButtonContainer,
  spaceBetween
} from './modal.scss';

const iconStyles = {
  iconContainer: modalIconContainer,
  iconStyle: modalIcon
};

const iconMap = {
  warning: WarningSign,
  success: SuccessIcon
};

const getButtonType = useWhiteButton => ({
  [useWhiteButton ? 'white' : 'light']: true
});

const Modal = ({
  showModal,
  onModalClose,
  title,
  subtitle,
  children,
  className,
  iconType,
  buttonContainerClassName,
  titleClassName = '',
  toggleModal: toggleShow,
  subtitleText = '',
  buttonProps = []
}) => {
  const { messages } = useContext(ConfigContext);
  const [animation, setAnimation] = useState(isMounting);
  const IconComponent = iconMap[iconType] || iconMap.warning;
  const hasMoreButtons = buttonProps.length > 1;
  const showSubtitle = subtitle || subtitleText;

  const getMessage = (key, alt = '') => messages[key] || alt;

  const toggleModal = func => {
    setAnimation(isUnmounting);

    setTimeout(() => {
      toggleShow();
      setAnimation(isMounting);

      if (_isFunction(func)) {
        func();
      }
    }, 200);
  };

  return (
    <OverlayComponent
      innerClassName={classnames(baseOverlayContainer, animation)}
      isOverlayOpen={showModal}
      toggleOverlayState={() => toggleModal(onModalClose)}
    >
      <div
        className={classnames(modalBody, {
          [className]: Boolean(className)
        })}
      >
        {iconType && <IconComponent {...iconStyles} />}
        <span
          className={classnames(modalTitle, titleClassName || modalTitleMargin)}
        >
          {getMessage(title)}
        </span>
        {showSubtitle && (
          <span className={modalSubtitle}>
            {getMessage(subtitle, subtitleText)}
          </span>
        )}
        {children}
        <div
          className={classnames(
            buttonContainerClassName || modalButtonContainer,
            {
              [spaceBetween]: hasMoreButtons
            }
          )}
        >
          {buttonProps.map(({ onClick, displayText, ...rest } = {}, key) => (
            <Button
              key={`button-${key}`}
              className={modalButton}
              onClick={() => toggleModal(onClick)}
              displayText={getMessage(displayText)}
              {...rest}
              {...getButtonType(key < 1 && hasMoreButtons)}
            />
          ))}
        </div>
      </div>
    </OverlayComponent>
  );
};

Modal.propTypes = {
  buttonContainerClassName: PropTypes.string,
  buttonProps: PropTypes.arrayOf(
    PropTypes.shape({
      displayText: PropTypes.string,
      onClick: PropTypes.func,
      className: PropTypes.string
    })
  ),
  children: PropTypes.node,
  className: PropTypes.string,
  iconType: PropTypes.string,
  showModal: PropTypes.bool,
  subtitle: PropTypes.string,
  subtitleText: PropTypes.string,
  titleClassName: PropTypes.string,
  toggleModal: PropTypes.func,
  onModalClose: PropTypes.func,
  title: PropTypes.string
};

export default Modal;
