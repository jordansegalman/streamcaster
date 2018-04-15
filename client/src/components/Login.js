import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoadingButton from './LoadingButton';
import './Login.css';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loading: false
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    fetch('https://streamcaster.me/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(responseJson => {
      this.setState({ loading: false });
      if (responseJson.response === 'Login successful') {
        this.props.authenticate(true);
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
      <div className="Login">
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
          <LoadingButton
            bsSize="large"
            bsStyle="primary"
            disabled={!this.validateForm()}
            type="submit"
            loading={this.state.loading}
            text="Log In"
            loadingText="Logging in..."
          />
        </form>
      </div>
    );
  }
}
