import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { errorBoundary } from '#/components/ErrorBoundary/errorBoundary.scss';

class ErrorBoundary extends Component {
  state = {
    error: null,
    errorInfo: null
  };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.error) {
      const componentStack = `${this.state.errorInfo.componentStack}`;
      const error = this.state.error.toString();

      if (__DEVTOOLS__) {
        return (
          <div className={errorBoundary}>
            <h3>Application Error</h3>
            <pre>{error}</pre>
            {!error.includes(componentStack) && <pre>{componentStack}</pre>}
          </div>
        );
      }

      return (
        <div className={errorBoundary}>
          <h3>An error has occurred</h3>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default ErrorBoundary;
