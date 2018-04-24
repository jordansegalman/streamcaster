import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import LoadingButton from './LoadingButton';
import './Register.css';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      loading: false,
      showUsernameInvalidAlert: false,
      showPasswordInvalidAlert: false,
      showPasswordsNotSameAlert: false,
      showUsernameTakenAlert: false
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0 && this.state.confirmPassword.length > 0 && this.state.password === this.state.confirmPassword;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true, showUsernameInvalidAlert: false, showPasswordInvalidAlert: false, showPasswordsNotSameAlert: false, showUsernameTakenAlert: false });
    fetch('https://streamcaster.me/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      this.setState({ loading: false });
      if (responseJson.response === 'Registration successful') {
        this.props.history.push('/');
      } else if (responseJson.response === 'Invalid username') {
        this.setState({ showUsernameInvalidAlert: true });
      } else if (responseJson.response === 'Invalid password') {
        this.setState({ showPasswordInvalidAlert: true });
      } else if (responseJson.response === 'Username exists') {
        this.setState({ showUsernameTakenAlert: true });
      }
    })
    .catch((error) => {
      this.setState({ loading: false });
      console.error(error);
    });
  }

  render() {
    return (
      <div className="Register">
        <div>
          <h1>Register</h1>
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="username" bsSize="large">
              <ControlLabel>Username</ControlLabel>
              <FormControl
                autoFocus
                type="text"
                value={this.state.username}
                placeholder="Username"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="confirmPassword" bsSize="large">
              <ControlLabel>Confirm Password</ControlLabel>
              <FormControl
                type="password"
                value={this.state.confirmPassword}
                placeholder="Confirm Password"
                onChange={this.handleChange}
              />
            </FormGroup>
            {this.state.showUsernameInvalidAlert && (
              <Alert>
                <p>Username must be 4 to 32 characters.</p>
              </Alert>
            )}
            {this.state.showPasswordInvalidAlert && (
              <Alert>
                <p>Password must be 8 to 64 characters.</p>
              </Alert>
            )}
            {this.state.showPasswordsNotSameAlert && (
              <Alert>
                <p>Passwords not the same.</p>
              </Alert>
            )}
            {this.state.showUsernameTakenAlert && (
              <Alert bsStyle="danger">
                <p>Username taken!</p>
              </Alert>
            )}
            <LoadingButton
              bsSize="large"
              bsStyle="primary"
              block
              disabled={!this.validateForm()}
              type="submit"
              loading={this.state.loading}
              text="Register"
              loadingText="Registering..."
            />
          </form>
        </div>
      </div>
    );
  }
}
