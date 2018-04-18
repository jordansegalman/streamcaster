import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import VideoPlayer from './VideoPlayer';
import './Live.css';

export default class Live extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      exists: false,
      live: false
    };
  }

  async componentDidMount() {
    try {
      await this.checkUserExists();
    } catch (e) {
      console.error(e);
    }
  }

  checkUserExists() {
    fetch('https://streamcaster.me/api/check_user_exists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.props.match.params.username
      }),
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.response === 'User exists') {
        this.setState({ exists: true });
        this.checkUserLive();
      } else {
        this.setState({ loading: false });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  checkUserLive() {
    fetch('https://streamcaster.me/api/check_user_live', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.props.match.params.username
      }),
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.response === 'User live') {
        this.setState({ live: true });
      }
      this.setState({ loading: false });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    const videoJsOptions = {
      sources: [{
        src: '/source/' + this.props.match.params.username + '.m3u8',
        type: 'application/x-mpegurl'
      }],
      autoplay: true,
      controls: true,
      preload: 'auto',
      aspectRatio: '16:9'
    }
    return (
      <div>
        {!this.state.loading && (this.state.exists
          ? this.state.live
            ? <Grid>
                <Row>
                  <Col lg={8} md={8} sm={8} xs={12}>
                    <VideoPlayer { ...videoJsOptions } />
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={12}>
                    <div id="chat">
                      <h2>Chat</h2>
                    </div>
                  </Col>
                </Row>
              </Grid>
            : <h1>Not Live</h1>
          : <h1>Page Not Found</h1>)
        }
      </div>
    );
  }
}
