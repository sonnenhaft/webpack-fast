import React, { Component } from 'react';
import cookie from 'react-cookie';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class WelcomeMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shownWelcomeMessage: cookie.load('shownWelcomeMessage')
    };
    this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ shownWelcomeMessage: true });
    cookie.save('shownWelcomeMessage', 'true', { path: '/' });
  }

  render() {
    const actions = [
      <FlatButton label="OK" primary onClick={this.handleClose.bind(this)} />
    ];

    return (
      <Dialog
        title="Welcome to the Viki application!"
        open={!this.state.shownWelcomeMessage}
        onRequestClose={this.handleClose.bind(this)}
        actions={actions}
        modal={false}
      >
        <div>
          This is a skeleton application which you can use for web projects
          within Accedo.
        </div>
        <br />
        <div>
          Take a look around to get an overview of it. Then feel free to dig in
          to the documentation for learning more about building with VDK Web.
        </div>
      </Dialog>
    );
  }
}
