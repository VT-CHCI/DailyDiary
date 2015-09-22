function days_between(date1, date2) {

  // The number of milliseconds in one day
  var ONE_DAY = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = Math.abs(date1_ms - date2_ms);

  // Convert back to days and return
  return Math.floor(difference_ms / ONE_DAY);

}

var participants = [];

// var Participant = function (phone, email) {
var Participant = function (options) {
  this.pid = participants.length;
  this.withdrawn = false;
  // this.started = new Date();
  this.text = true;
  if (options.hasOwnProperty('phone')) {
    this.phone = options.phone;
  } else {
    this.text = false;
  }
  if (options.hasOwnProperty('fName')) {
    this.fName = options.fName;
  }
  if (options.hasOwnProperty('email')) {
    this.email = options.email;
  }

  if (options.hasOwnProperty('start')) {
    this.started = options.start;
  }

  if (options.hasOwnProperty('link')) {
    this.link = options.link;
  }
};

// BEWAAAAAARE! the date in `new Date()` on the next line expects the 
// 0-based index of the year (6 is july, not june), but expects typical 
// gregorian year and day. dumb.
participants.push(new Participant({fName: 'their first name', email: 'their+email@vt.edu', phone: '5408675309', start: new Date(2015, 6, 20), link:'custom link in case they"re having trouble'}));

exports.participants = participants;
exports.Participant = Participant;
exports.MAX_DAYS = 14;
exports.days_between = days_between;
