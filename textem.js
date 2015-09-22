var models = require('./models');
var nodemailer = require('nodemailer');
// var RSVP = require('rsvp');
// Twilio Credentials 
var accountSid = 'yourtwilioinfo';
var authToken = 'yourothertwilioinfo';

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken);

var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    XOAuth2: {
      user: "your+email@vt.edu", // Your gmail address.
                                            // Not @developer.gserviceaccount.com
      clientId: "yourgobbledygook.apps.googleusercontent.com",
      clientSecret: "yourothergobbledygook",
      refreshToken: "lastgobbledygook"
    }
  }
});

function textParticipant(participant) {
  console.log('got participant', participant);
  if (participant.withdrawn !== true && (!participant.hasOwnProperty('started') || models.days_between(participant.started, new Date()) < models.MAX_DAYS)) {
    console.log('going to text', participant);
    messageParticipant(participant);
  } else {
    console.log("don't text them");
  }
}

function messageParticipant (participant) {
  // note: the pid argument here required me to modify the qualtrics 
  // questionnaire to notice the parameter and autofill for the participant
  // see the other js file
  var link = "youqualtricslink#pid=" + participant.pid; 
  if (participant.link) {
    console.log('participant has custom link');
    link = participant.link;
  }
  // if (participant.withdrawn !== true) {
    var greeting = '';
    if (participant.hasOwnProperty('fName')) {
      greeting = 'Hi '+ participant.fName + ', ';
    }
    greeting = greeting + 'You are participant number: ' + participant.pid + '. ';
    if (participant.text) {
      console.log('using sms for', participant.phone);
      client.messages.create({
        to: participant.phone,
        from: "+YOURTWILIONUMBER",
        body: greeting+"WHATEVER MESSAGE "+link,
      }, function (err, message) {
        console.log(message.sid);
        if (err) {
          console.error(err);
        }
      });
    } else {
      console.log('using email for', participant.email);
      var mailOptions = {
        from: "your+email@vt.edu",
        to: participant.email,
        subject: "WHATEVER SUBJECT",
        generateTextFromHTML: true,
        html: greeting+'<a href="' + link + '">Please click here to complete today\'s survey: ' + link + '</a>'
      };
      smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log("error sending a message, try once more", mailOptions, error, response);
          smtpTransport.sendMail(mailOptions, function(error2, response2) {
            if (error2) {
              console.log('erred a 2nd time', error2, mailOptions);
            } else {
              console.log(response2);
            }
          });
        } else {
          console.log(response);
        }
        // smtpTransport.close();
      });
    }
  // }
}

function textEmAll() {
  console.log(new Date(), 'going to text all ', models.participants.length, '+ participants');
  models.participants.forEach(textParticipant);
}

console.log('started textem', new Date());
var CronJob = require('cron').CronJob;
new CronJob('00 00 18 * * *', function () {
  console.log('starting cronned job');
  textEmAll();
}, null, true, 'America/New_York');
