import React, { Component } from 'react';
import { Grid, Row, Col, Thumbnail } from 'react-bootstrap';
import './Home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      streams: [],
      date: Date.now()
    };

    this.getStreams = this.getStreams.bind(this);
  }

  async componentDidMount() {
    try {
      await this.getStreams();
    } catch (e) {
      console.error(e);
    }
    this.interval = setInterval(this.getStreams, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getStreams() {
    fetch('https://streamcaster.me/api/get_streams')
    .then(response => response.json())
    .then(responseJson => {
      this.setState({ loading: false });
      if (responseJson.response === 'Success') {
        this.setState({ streams: responseJson.usernames, date: Date.now() });
      }
    })
    .catch((error) => {
      this.setState({ loading: false });
      console.error(error);
    });
  }

  handleStreamClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderStreams(streams) {
    return streams.map((stream) =>
      <Col lg={4} md={6} sm={6} xs={12} key={stream}>
        <Thumbnail src={"/thumbnails/" + stream + ".png?" + this.state.date} alt={stream} href={"/live/" + stream} onClick={this.handleStreamClick}>
          <h3>{stream}</h3>
        </Thumbnail>
      </Col>
    );
  }

  render() {
    return (
      <div className="Home">
        <h1>Live</h1>
        <div className="streams">
          <Grid>
            <Row>
              {!this.state.loading && this.renderStreams(this.state.streams)}
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}
