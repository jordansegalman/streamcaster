import React, { Component } from 'react';
import { PageHeader, ListGroup } from 'react-bootstrap';
import './Home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      streams: []
    };
  }

  renderStreamList(streams) {
    return null;
  }

  renderStreams() {
    return (
      <div className="streams">
        <PageHeader>Streams</PageHeader>
        <ListGroup>
          {!this.state.loading && this.renderStreamList(this.state.streams)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.renderStreams()}
      </div>
    );
  }
}
