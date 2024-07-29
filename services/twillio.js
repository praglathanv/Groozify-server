const twilio = require('twilio');

// Replace these values with your Twilio Account SID and Auth Token
const accountSid ='AC83b7c3ebfef86c7035a259352a6c5342';
const authToken ='76c302b8302b9942dc2f97a8437d9e6c';

// Initialize Twilio client
const client = twilio(accountSid, authToken);

module.exports = client;
