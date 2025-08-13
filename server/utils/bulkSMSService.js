// utils/smsSender.js
const axios = require('axios');

const BULKSMS_API_URL = 'https://bulksms.ma/developer/sms/send';
const BULKSMS_TOKEN = 'your_api_token_here'; // Replace with your actual token

const sendSMS = async (phoneNumber, message, senderId = '') => {
  try {
    const response = await axios.get(BULKSMS_API_URL, {
      params: {
        token: BULKSMS_TOKEN,
        message: message,
        tel: phoneNumber,
        shortcode: senderId // Optional sender ID
      },
      paramsSerializer: params => {
        return Object.keys(params)
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = { sendSMS };