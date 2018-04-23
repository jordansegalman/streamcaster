import React, { Component } from 'react';
import videojs from 'video.js';
import 'videojs-contrib-hls';
import 'video.js/dist/video-js.css';
import './VideoPlayer.css';

export default class VideoPlayer extends Component {
  componentDidMount() {
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      this.on('loadeddata', () => {
        if (this.error() == null) {
          this.show();
        }
      });
    });
    this.player.hide();
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    window.HELP_IMPROVE_VIDEOJS = false;
    return (
      <div className="VideoPlayer" data-vjs-player>
        <video ref={ node => this.videoNode = node } className="video-js"></video>
      </div>
    );
  }
}
