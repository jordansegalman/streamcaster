import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import LoadingButton from './LoadingButton';
import './StreamKeyModal.css'

export default class StreamKeyModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      streamKey: "",
      getLoading: false,
      changeLoading: false
    };

    this.handleView = this.handleView.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleView() {
    this.setState({ getLoading: true });
    fetch('https://streamcaster.me/api/get_stream_key', {
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.response === 'Success') {
        this.setState({ streamKey: responseJson.streamKey, show: true, getLoading: false });
      }
    })
    .catch((error) => {
      this.setState({ getLoading: false });
      console.error(error);
    });
  }

  handleChange() {
    this.setState({ changeLoading: true });
    fetch('https://streamcaster.me/api/change_stream_key', {
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.response === 'Success') {
        this.setState({ streamKey: responseJson.streamKey, changeLoading: false });
      }
    })
    .catch((error) => {
      this.setState({ changeLoading: false });
      console.error(error);
    });
  }

  handleClose() {
    this.setState({ streamKey: "", show: false });
  }

  render() {
    return ([
        <LoadingButton
          bsSize="large"
          bsStyle="primary"
          block
          type="button"
          loading={this.state.getLoading}
          text="View Stream Key"
          loadingText="View Stream Key"
          onClick={this.handleView}
          key="0"
        />,
        <Modal className="StreamKeyModal" show={this.state.show} onHide={this.handleClose} key="1">
          <Modal.Header>
            <Modal.Title>Stream Key</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.streamKey}</p>
          </Modal.Body>
          <Modal.Footer>
            <LoadingButton
              type="button"
              loading={this.state.changeLoading}
              text="Change Stream Key"
              loadingText="Change Stream Key"
              onClick={this.handleChange}
            />
            <Button bsStyle="primary" onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    ]);
  }
}
