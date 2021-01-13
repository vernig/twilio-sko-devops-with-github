const Twilio = require('twilio');

describe('Test voice response TwiML', () => {
 beforeAll(() => {
   global.Twilio = Twilio;
 });

 it('returns "Hello World" TwiML response', (done) => {
   const tokenFunction = require('../functions/hello-world').handler;

   const callback = (err, twimlResponse) => {
     expect(twimlResponse.toString()).toBe(
       '<?xml version="1.0" encoding="UTF-8"?><Response><Say>Hello World!</Say></Response>'
     );
     done();
   };

   tokenFunction(null, {}, callback);
 });
});
