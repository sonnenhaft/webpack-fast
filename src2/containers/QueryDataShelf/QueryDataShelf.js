import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Shelf from '#/components/Shelf';
import Button from '#/components/Button/Button';
import modules from '#/redux/modules';
import * as templates from '#/config/templates';

const mapStateToProps = (state, ownProps) => {
  const dataKey = ownProps.query;

  if (!dataKey) {
    return;
  }

  let data = modules.vikimapQueries.selectors.getData(state, dataKey);

  if (!data) {
    data = state[dataKey];
  }

  if (data && data.__isError) {
    return {
      dataKey,
      failedToLoad: data.content
    };
  }

  if (!data || !data.content || data.__isFetching) {
    return {
      dataKey,
      loaded: false,
      isLoading: data ? data.__isFetching : false
    };
  }

  return {
    dataKey,
    queryData: data.content,
    loaded: true
  };
};

class QueryDataShelf extends React.Component {
  static loadData({ dispatch, dataKey, failedToLoad, isLoading, staticData }) {
    if (failedToLoad || isLoading || staticData) {
      return;
    }

    if (!dataKey) {
      return;
    }

    return dispatch(modules.vikimapQueries.actions.getData(dataKey));
  }

  componentDidMount() {
    QueryDataShelf.loadData(this.props);
  }

  componentDidUpdate() {
    QueryDataShelf.loadData(this.props);
  }

  retryLoad() {
    const dataKey = this.props.query;
    this.props.dispatch(modules.vikimapQueries.actions.retry(dataKey));
  }

  render() {
    const {
      queryData,
      loaded,
      failedToLoad,
      onRetry,
      ...restProps
    } = this.props;

    if (failedToLoad) {
      return <Button onClick={onRetry}>Failed to load. Please retry.</Button>;
    }

    return (
      <div>
        {loaded ? (
          <Shelf
            templates={templates}
            itemType="query"
            items={queryData}
            {...restProps}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

QueryDataShelf.propTypes = {
  dispatch: PropTypes.func,
  failedToLoad: PropTypes.any, // coming from content
  loaded: PropTypes.any,
  onRetry: PropTypes.func,
  query: PropTypes.any,
  queryData: PropTypes.any,
  template: PropTypes.string
};

export default connect(mapStateToProps)(QueryDataShelf);
