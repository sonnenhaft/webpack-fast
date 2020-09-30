import React, { useRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';

import {
  filterMenu,
  filterMenuHover,
  filterMenuItem
} from './transactions.scss';

const RangeMenuItem = ({ displayText, onClick = noop }) => (
  <div className={filterMenuItem} onClick={onClick}>
    {displayText}
  </div>
);

const RangeMenu = ({ onSelect = noop, filters = [] }) => {
  const menuRef = useRef(null);

  const onItemClick = filter => {
    const { classList } = menuRef.current || {};

    onSelect(filter);
    classList?.remove(filterMenuHover);

    setTimeout(() => {
      classList?.add(filterMenuHover);
    }, 100);
  };

  return (
    <div ref={menuRef} className={classnames(filterMenu, filterMenuHover)}>
      {filters.map(filter => {
        const { title, name } = filter || {};

        return (
          <RangeMenuItem
            key={name}
            displayText={title}
            onClick={() => onItemClick(filter)}
          />
        );
      })}
    </div>
  );
};

RangeMenuItem.propTypes = {
  displayText: PropTypes.string,
  onClick: PropTypes.func
};

RangeMenu.propTypes = {
  onSelect: PropTypes.func,
  filters: PropTypes.array
};

export default RangeMenu;
