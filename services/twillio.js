const twilio = require('twilio');

// Replace these values with your Twilio Account SID and Auth Token
const accountSid ='';
const authToken ='';

// Initialize Twilio client
const client = twilio(accountSid, authToken);

module.exports = client;
