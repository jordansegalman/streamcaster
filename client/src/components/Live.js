import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import VideoPlayer from './VideoPlayer';
import './Live.css';

export default class Live extends Component {
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
        <Grid>
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
      </div>
    );
  }
}
