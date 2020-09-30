import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { models } from '@accedo/vdkweb-vikimap/lib/ui';
import kebabCase from 'lodash/kebabCase';
import Menu from '#/components/VikimapMenu';

import { useVikimapQuery } from '#/services/vikimap';
import { PageContext } from '#/utils/context';

const MESSAGE = 'Message';
const getTargetForMenuItem = item => {
  if (item.page && item.page.alias) {
    return `/${item.page.alias}`;
  }
  if (item.page) {
    return `/${item.page}`;
  }

  if (item.action) {
    return `/${item.action}`;
  }

  return `/${kebabCase(item.displayText)}`;
};

const getTargetByPageData = ({
  _meta: { entryAlias } = {},
  pageid,
  subMenuItems = []
} = {}) => {
  const subMenuDefaultPageId = subMenuItems[0]?.pageid;

  return entryAlias || subMenuDefaultPageId || pageid;
};

const mapMenuItem = item => {
  const {
    displayText,
    menuItems,
    icon,
    pageData = {},
    pageid: subMenuPageId,
    to
  } = item;
  const { subMenuItems } = pageData;
  const targetByPageData = getTargetByPageData(pageData);
  const menuItemLink =
    to ||
    (targetByPageData && `/${targetByPageData}`) ||
    (subMenuPageId && `/${subMenuPageId}`) ||
    getTargetForMenuItem(item);

  return {
    displayText,
    to: menuItemLink,
    items: (menuItems || subMenuItems)?.map(mapMenuItem),
    icon: icon && icon[0] ? icon[0].fileUrl : null,
    isDisabled: Boolean(subMenuItems?.length)
  };
};

const VikimapMenu = ({
  isCollapsible,
  isCollapsed,
  onMenuItemClick,
  theme
}) => {
  const [vikimapQuery, { data, error, loading } = {}] =
    useVikimapQuery(false) || [];
  const { setRouteToDisplayTextMap } = useContext(PageContext);

  const {
    accedoOne: {
      menu: { items, staticItems = [], _meta: { id } = {} } = {}
    } = {}
  } = data || {};

  const failedToLoad = !id || error;

  const others = {
    ...(failedToLoad && { failedToLoad }),
    [`error${failedToLoad ? MESSAGE : ''}`]: error
  };

  useEffect(() => {
    vikimapQuery();
  }, []);

  useEffect(() => {
    if (items) {
      const routeToDisplayText = items.reduce(
        (
          map,
          {
            displayText,
            pageData: {
              description,
              keywords,
              pageid,
              subMenuItems,
              _meta: { entryAlias } = {}
            } = {}
          }
        ) => {
          if (subMenuItems?.length) {
            return subMenuItems.reduce(
              (
                subMenuMap,
                {
                  description: subDescription,
                  keywords: subKeywords,
                  displayText: subDisplayText,
                  pageid: subPageId
                }
              ) => {
                return {
                  ...map,
                  ...subMenuMap,
                  [`/${subPageId}`]: {
                    metaTitle: subDisplayText,
                    metaDescription: subDescription,
                    metaKeywords: subKeywords
                  }
                };
              },
              {}
            );
          }

          return {
            ...map,
            [`/${entryAlias || pageid}`]: {
              metaTitle: displayText,
              metaDescription: description,
              metaKeywords: keywords
            }
          };
        },
        {}
      );

      setRouteToDisplayTextMap(routeToDisplayText);
    }
  }, [items]);

  return (
    <Menu
      items={
        !loading && items ? items.concat(staticItems).map(mapMenuItem) : []
      }
      entryId={id}
      isCollapsed={isCollapsed}
      isCollapsible={isCollapsible}
      loaded={!loading}
      onMenuItemClick={onMenuItemClick}
      theme={theme}
      {...others}
    />
  );
};

VikimapMenu.propTypes = {
  dispatch: PropTypes.func,
  entry: PropTypes.object,
  entryId: PropTypes.string,
  isCollapsed: PropTypes.bool,
  isCollapsible: PropTypes.bool,
  items: PropTypes.arrayOf(models.MenuItem),
  loaded: PropTypes.bool,
  onMenuItemClick: PropTypes.func,
  staticItems: PropTypes.array,
  theme: PropTypes.shape({ menu: PropTypes.string })
};

export default VikimapMenu;
