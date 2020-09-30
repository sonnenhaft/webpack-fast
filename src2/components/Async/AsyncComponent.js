import React from 'react';
import PropTypes from 'prop-types';

class AsyncComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      Component: null
    };
  }

  componentDidMount() {
    if (!this.state.Component) {
      this.props
        .moduleProvider()
        .then(Component => this.setState({ Component }));
    }
  }

  render() {
    const { Component } = this.state;

    return this.props.children(Component);
  }
}

AsyncComponent.propTypes = {
  children: PropTypes.func,
  moduleProvider: PropTypes.func.isRequired
};

export default AsyncComponent;
