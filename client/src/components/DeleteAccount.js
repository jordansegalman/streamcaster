import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoadingButton from './LoadingButton';
import './DeleteAccount.css';

export default class DeleteAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      loading: false
    };
  }

  validateForm() {
    return this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  attemptDelete = event => {
    event.preventDefault();
    this.setState({ loading: true });
    fetch('https://streamcaster.me/api/delete_account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: this.state.password
      }),
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(responseJson => {
      this.setState({ loading: false });
      if (responseJson.response === 'Account deletion successful') {
        this.props.deauthenticate();
        this.props.history.push('/');
      }
    })
    .catch((error) => {
      this.setState({ loading: false });
      console.error(error);
    });
  }

  render() {
    return (
      <div className="DeleteAccount">
        <div>
          <h1>Delete Account</h1>
          <form onSubmit={this.attemptDelete}>
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                autoFocus
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={this.handleChange}
              />
            </FormGroup>
            <LoadingButton
              bsSize="large"
              bsStyle="danger"
              block
              disabled={!this.validateForm()}
              type="submit"
              loading={this.state.loading}
              text="Delete Account"
              loadingText="Deleting account..."
            />
          </form>
        </div>
      </div>
    );
  }
}
