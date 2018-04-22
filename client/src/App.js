import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Routes from './routes';
import logo from './streamcaster_logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      authenticated: false,
      username: ''
    };
  }

  authenticate = u => {
    this.setState({ authenticated: true, username: u, loading: false });
  }

  deauthenticate = () => {
    this.setState({ authenticated: false, username: '', loading: false });
  }

  checkAuthenticated() {
    fetch('https://streamcaster.me/api/check_authenticated', {
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.response === 'Authenticated') {
        this.authenticate(responseJson.username);
      } else {
        this.deauthenticate();
      }
    })
    .catch((error) => {
      this.setState({ loading: false });
      console.error(error);
    });
  }

  componentDidMount() {
    this.checkAuthenticated();
  }

  render() {
    const childProps = {
      authenticated: this.state.authenticated,
      username: this.state.username,
      authenticate: this.authenticate,
      deauthenticate: this.deauthenticate
    };
    return (
      <div className="App">
        {!this.state.loading && (
          <div>
            <Navbar fluid inverse fixedTop collapseOnSelect>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/">
                    <img src={logo} alt="Streamcaster Logo" />
                  </Link>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav pullRight>
                  {this.state.authenticated
                    ? <Fragment>
                        <LinkContainer to="/account">
                          <NavItem>Account</NavItem>
                        </LinkContainer>
                      </Fragment>
                    : <Fragment>
                        <LinkContainer to="/login">
                          <NavItem>Log In</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/register">
                          <NavItem>Register</NavItem>
                        </LinkContainer>
                      </Fragment>
                  }
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <Routes childProps={childProps} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
