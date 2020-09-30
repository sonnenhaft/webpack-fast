import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Container from '#/containers/Container/Container';
import Button from '#/components/Button/Button';
import { CrossIcon, SearchMenuIcon } from '#/components/Icons';
import { AccedoOneContainerCardType } from '#/config/templates';
import {
  VJS_CUSTOM_COMPONENTS,
  ROUTE,
  ON_RECOMMENDATION_CHANGE
} from '#/constants';

import { searchButton, searchIconStyle } from '../nagraPlayerOverlay.scss';

const {
  BACK_BUTTON,
  CONTROL_BAR_CLICKABLE_COMPONENT,
  REACT_VJS_COMPONENT,
  RECOMMENDATION_RAILS_OVERLAY
} = VJS_CUSTOM_COMPONENTS;
const { Landscape } = AccedoOneContainerCardType;
const RAIL_TEMPLATE = 'carousel';
const SEARCH_BUTTON_TEXT = 'SEARCH';

export const toggleRecommendationRailsOverlay = ({ playerInstance = {} }) =>
  playerInstance?.getChild(RECOMMENDATION_RAILS_OVERLAY).setToggleState();

const crossIconProperties = {
  className: 'vjs-custom-cross-icon',
  iconSrc: <CrossIcon />,
  buttonFunction: toggleRecommendationRailsOverlay
};

const RecommendationRail = ({ title = '', ...restProps }) => (
  <Container
    cardType={Landscape}
    displayText={title}
    isPlayerRail
    template={RAIL_TEMPLATE}
    {...restProps}
  />
);

const RecommendationContainer = ({ playerInstance }) => {
  const { state } = playerInstance || {};
  const [railData, setRailData] = useState(null);
  const { entitlements, recommendations = [] } = state || {};

  useEffect(() => {
    const onChange = event => {
      const { detail } = event || {};
      const { recommendations: recommendationsFromEvent } = detail || {};

      setRailData(recommendationsFromEvent);
    };

    window.addEventListener(ON_RECOMMENDATION_CHANGE, onChange);

    return () => window.removeEventListener(ON_RECOMMENDATION_CHANGE, onChange);
  }, []);

  const navigateFromPlayer = route => {
    if (!playerInstance) {
      return;
    }

    playerInstance.setState?.({
      ...state,
      routeChange: route
    });
    if (playerInstance.isFullscreen()) {
      playerInstance.exitFullscreen();
    }
    playerInstance.getChild(BACK_BUTTON)?.trigger('click');
  };

  const navigateToSearch = () => navigateFromPlayer(ROUTE.SEARCH);

  const recommendationRails = (railData || recommendations || []).map(
    recommendation => {
      const { id = '' } = recommendation || {};

      return (
        <RecommendationRail
          key={`player-${id}`}
          navigateFromPlayer={navigateFromPlayer}
          playerEntitlements={entitlements}
          {...recommendation}
        />
      );
    }
  );

  return (
    <div className="vjs-recommendation-rails-container">
      {recommendationRails}
      <Button white className={searchButton} onClick={navigateToSearch}>
        <SearchMenuIcon iconStyle={searchIconStyle} />
        <span>{SEARCH_BUTTON_TEXT}</span>
      </Button>
    </div>
  );
};

export const registerRecommendationRailsOverlay = ({ videojs = {} }) => {
  const Component = videojs.getComponent('Component');
  const OverlayComponent = videojs.extend(Component, {
    constructor(...args) {
      Component.apply(this, args);
    },

    createEl() {
      this.toggleState = false;

      return videojs.dom.createEl('div', {
        className: `vjs-recommendation-rails-overlay ${
          this.toggleState ? '' : 'inactive'
        }`
      });
    },

    setToggleState() {
      if (this.toggleState) {
        videojs.dom.addClass(this.el(), 'inactive');
        this.toggleState = false;

        return;
      }

      videojs.dom.removeClass(this.el(), 'inactive');
      this.toggleState = true;
      if (__CLIENT__) {
        window.dispatchEvent(new Event('resize'));
      }
    }
  });

  videojs.registerComponent(RECOMMENDATION_RAILS_OVERLAY, OverlayComponent);
};

export const addRecommendationRailsOverlay = ({ playerInstance = {} }) => {
  const recommendationRailsOverlay = playerInstance.addChild(
    RECOMMENDATION_RAILS_OVERLAY
  );
  const crossIconButton = recommendationRailsOverlay.addChild(
    CONTROL_BAR_CLICKABLE_COMPONENT,
    crossIconProperties
  );
  crossIconButton.addChild(REACT_VJS_COMPONENT, crossIconProperties);
  recommendationRailsOverlay.addChild(REACT_VJS_COMPONENT, {
    rail: <RecommendationContainer playerInstance={playerInstance} />
  });
};

RecommendationRail.propTypes = {
  title: PropTypes.string
};

RecommendationContainer.propTypes = {
  playerInstance: PropTypes.shape({
    state: PropTypes.shape({
      entitlements: PropTypes.object,
      recommendations: PropTypes.array
    })
  })
};
