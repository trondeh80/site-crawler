const fetch = require('node-fetch');
const MAX_CONN = 5; // Prevent erroring with nodes MAX connection
const connectionInterval = 100;
let connectionCount = 0;

function get(url, options = {}) {
  return new Promise((resolve, reject) => {
    retry(() =>
      httpGet(url, options)
        .then(data => resolve(data))
        .catch(err => reject(err))
    );
  });
}

// Keeps checking connectionCount for available connection spot.
function retry(getFn) {
  return new Promise((resolve) => {
    let timer;
    if (connectionCount === MAX_CONN) {
      timer = setInterval(() => {
        if (connectionCount < MAX_CONN) {
          clearInterval(timer);
          getFn().then(data => resolve(data));
        }
      }, connectionInterval);
    } else {
      getFn().then(data => resolve(data));
    }
  });
}

// Throws exception!
function httpGet(url, options) {
  connectionCount++;
  return fetch(url, getOptions(options))
    .then((response) => {
      connectionCount--;
      if (response.status !== 200) {
        throw response;
      }
      return response.text();
    }).catch((err) => {
      connectionCount--;
      throw err; // Throw exception further up chain.
    });
}

function getOptions(options) {
  return {
    method: 'GET',
    credentials: 'same-origin',
    'content-type': 'text/html',
    ...options
  };
}

module.exports = {
  get
};