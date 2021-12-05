import sgMail from "@sendgrid/mail";
sgMail.setApiKey("");
const msg = {
  to: "ptmdmusic@gmail.com",
  from: "ptmdmusic@gmail.com",
  subject: "Sending with Twilio SendGrid is Fun",
  // text: "and easy to do anywhere, even with Node.js 2222222",
  html:
    "<p>The alert for FANG has been met</p><ul><li>Price is above $1.00 limit</li></ul>",
  // content: "test content",
};

//ES8
(async () => {
  try {
    const result = await sgMail.send(msg);
    console.log(result);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
})();
