import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ConfigContext } from '#/utils/context';
import Button from '#/components/Button/Button';
import { PinInput } from '#/components/Input';
import { noop } from '#/helpers';

import {
  seperator,
  subsection,
  subsectionButton,
  subsectionDisabled,
  subsectionTitle,
  subsectionSubtitle
} from './subSection.scss';

const SubSectionHeader = ({
  title,
  subtitle,
  showSubtitle = true,
  disabled = false
}) => {
  const disabledClassName = disabled && subsectionDisabled;

  return (
    title && (
      <Fragment>
        <h3 className={classnames(subsectionTitle, disabledClassName)}>
          {title}
        </h3>
        {showSubtitle && (
          <p className={classnames(subsectionSubtitle, disabledClassName)}>
            {subtitle}
          </p>
        )}
      </Fragment>
    )
  );
};

const SubSection = ({
  className,
  children,
  title,
  subtitle,
  buttonText,
  seperatorClassName,
  noSeperator = false,
  buttonType = 'white',
  buttonClassName,
  noSubtitle = false,
  buttonDisabled = false,
  disabled = false,
  pinInputProps = [],
  onClick = noop
}) => {
  const { messages = {} } = useContext(ConfigContext);

  const getMessage = key => messages[key] || '';

  const buttonProps = {
    [buttonType]: true,
    disabled: buttonDisabled || disabled
  };

  const containerClasses = classnames(subsection, {
    [className]: Boolean(className)
  });

  return (
    <Fragment>
      {!noSeperator && (
        <div className={classnames(seperator, seperatorClassName)} />
      )}
      <div className={containerClasses}>
        <SubSectionHeader
          disabled={disabled}
          title={getMessage(title)}
          subtitle={getMessage(subtitle)}
          showSubtitle={!noSubtitle}
        />
        {pinInputProps.map(({ inputTitle, ...rest } = {}, idx) => (
          <Fragment key={`pininput-${idx}`}>
            <SubSectionHeader title={getMessage(inputTitle)} />
            <PinInput {...rest} />
          </Fragment>
        ))}
        {children}
        {buttonText && (
          <Button
            {...buttonProps}
            displayText={getMessage(buttonText)}
            onClick={onClick}
            className={classnames(subsectionButton, {
              [buttonClassName]: Boolean(buttonClassName)
            })}
          />
        )}
      </div>
    </Fragment>
  );
};

SubSectionHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  disabled: PropTypes.bool
};

SubSection.propTypes = {
  buttonClassName: PropTypes.string,
  buttonDisabled: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonType: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  noSubtitle: PropTypes.bool,
  noSeperator: PropTypes.bool,
  pinInputProps: PropTypes.array,
  seperatorClassName: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string
};

export default SubSection;
