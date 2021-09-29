'use strict';

class TestTransport {
  constructor() {
    this.callback = null;
  }

  onMessage(callback) {
    this.callback = callback;
  }

  send(message) {
    if (this.callback) {
      return;
    }

    this.callback(message);
  }
}

module.exports = TestTransport;
