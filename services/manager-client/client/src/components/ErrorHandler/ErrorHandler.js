import React, { Component } from 'react';

export default class ErrorHandler extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <section style={{ textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
        </section>
      );
    }

    return this.props.children;
  }
}
