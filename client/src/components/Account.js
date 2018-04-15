import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import LoadingButton from './LoadingButton';
import './Account.css';

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.attemptLogout = this.attemptLogout.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  attemptLogout() {
    this.setState({ loading: true });
    fetch('https://streamcaster.me/api/logout', {
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.response === 'Logout successful') {
        this.setState({ loading: false });
        this.props.authenticate(false);
        this.props.history.push('/');
      }
    })
    .catch((error) => {
      this.setState({ loading: false });
      console.error(error);
    });
  }

  handleDelete() {
    this.props.history.push('/delete_account');
  }

  render() {
    return (
          <div>
            <LoadingButton
              bsSize="large"
              type="button"
              loading={this.state.loading}
              text="Log Out"
              loadingText="Logging out..."
              onClick={this.attemptLogout}
            />
            <Button
              bsSize="large"
              type="button"
              bsStyle="danger"
              onClick={this.handleDelete}
            >
              Delete Account
            </Button>
          </div>
    );
  }
}
