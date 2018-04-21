import React, { Component } from 'react';
import io from 'socket.io-client';
import './Chat.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      loading: true
    };
  }

  componentDidMount() {
    this.setupSocketIO();
  }

  componentWillUnmount() {
    if (this.state.socket != null && this.state.socket.connected) {
      this.state.socket.disconnect();
      this.state.socket.off();
      this.setState({ socket: null, loading: true });
    }
  }

  setupSocketIO() {
    if (this.state.socket == null || this.state.socket.disconnected) {
      const newSocket = io({
        autoConnect: false
      });
      newSocket.on('connect', () => {
        this.setState({ socket: newSocket });
        this.state.socket.emit('joinRoom', this.props.username, () => {
          this.setState({ loading: false });
          this.state.socket.emit('message', { room: this.props.username, message: 'hello' });
        });
      });
      newSocket.on('message', (message) => {
        alert(message);
      });
      newSocket.connect();
    }
  }

  render() {
    return (
      <div id="chat">
        {!this.state.loading && <h2>Chat</h2>}
      </div>
    );
  }
}
