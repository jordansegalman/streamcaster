import React, { Component } from 'react';
import { Panel, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import './Chat.css';

const MAX_MESSAGES = 1000;
const MAX_MESSAGE_LENGTH = 500;

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      loading: true,
      messages: [],
      message: ''
    };
  }

  componentDidMount() {
    this.setupSocketIO();
  }

  componentWillUnmount() {
    if (this.state.socket != null && this.state.socket.connected) {
      this.state.socket.disconnect();
      this.state.socket.off();
    }
  }

  setupSocketIO() {
    if (this.state.socket == null || this.state.socket.disconnected) {
      const newSocket = io({
        autoConnect: false
      });
      newSocket.on('connect', () => {
        this.setState({ socket: newSocket });
        this.state.socket.emit('joinStream', this.props.stream, () => {
          this.setState({ loading: false });
        });
      });
      newSocket.on('message', (message) => {
        this.addMessage(message);
      });
      newSocket.connect();
    }
  }

  addMessage(message) {
    if (this.state.messages.length === MAX_MESSAGES) {
      this.setState({ messages: [...(this.state.messages.splice(0, MAX_MESSAGES - 1)), message] });
    } else {
      this.setState({ messages: [...this.state.messages, message] });
    }
  }

  sendMessage = event => {
    event.preventDefault();
    if (this.props.authenticated && this.props.username.length > 0 && this.state.message.length > 0 && this.state.message.length <= MAX_MESSAGE_LENGTH) {
      this.state.socket.emit('message', { stream: this.props.stream, username: this.props.username, message: this.state.message });
      this.setState({ message: '' });
    } else if (!this.props.authenticated || this.props.username.length === 0) {
      this.setState({ message: '' });
      alert('Log in to chat.');
    }
  }

  validateForm() {
    return this.state.message.length > 0 && this.state.message.length <= MAX_MESSAGE_LENGTH;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  renderChat() {
    return (
      <Panel>
        <Panel.Heading>
          Chat
        </Panel.Heading>
        <Panel.Body>
          <div>
            {this.state.messages.map(message =>
              <div key={message.username + message.message + message.date}><p id="chat-username">{message.username}:</p><p id="chat-message"> {message.message}</p></div>
            )}
          </div>
        </Panel.Body>
        <Panel.Footer>
        <Form onSubmit={this.sendMessage}>
          <FormGroup controlId="message">
            <FormControl
              componentClass="textarea"
              value={this.state.message}
              placeholder="Message"
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button
            type="submit"
            bsStyle="primary"
            disabled={!this.validateForm()}
          >
            Send
          </Button>
        </Form>
        </Panel.Footer>
      </Panel>
    );
  }

  render() {
    return (
      <div className="Chat">
        {!this.state.loading && this.renderChat()}
      </div>
    );
  }
}
