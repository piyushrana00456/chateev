const moment = require("moment");

function messageformat(username, text) {
  return {
    username,
    text,
    time: moment().locale().format("h:mm a"),
  };
}

module.exports = messageformat;
