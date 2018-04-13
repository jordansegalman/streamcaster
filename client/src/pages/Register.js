import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Register.css';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      loading: false
    };
  }

  validateForm() {
    return this.state.username.length >= 4 && this.state.username.length <= 32 && this.state.password.length >= 8 && this.state.password.length <= 64 && this.state.password.length >= 8 && this.state.password.length <= 64 && this.state.password === this.state.confirmPassword;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
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
      if (responseJson.response === 'Registration successful') {
        this.props.authenticate(true);
        this.props.history.push('/');
      }
    })
    .catch((error) => {
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
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              type="password"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            loading={this.state.loading}
            text="Register"
            loadingText="Registering..."
          />
        </form>
      </div>
    );
  }
}
