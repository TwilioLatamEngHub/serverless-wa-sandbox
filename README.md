# WhatsApp Sandbox for Flex Conversations

## Important Notes

**Make sure you have the [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started) installed before proceding.**

**Known issue: This function does not handle creating a conversation correctly when the first WhatsApp message is an attachment. This may result in warnings/errors logged by the Studio Flow. This is not an issue for non-sandbox WhatsApp addresses.**

## Steps

1. Clone this repo.

2. Rename the `.env.example` file to `.env` and fill it if your Account SID, Auth Token and the Studio Flow that you use to send the conversations to Flex.

3. Run `twilio serverless:deploy` and copy the URL function that will appear in the terminal after the deploy under `Functions:`.

4. Go to [WhatsApp Sandbox Settings](https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox?frameUrl=%2Fconsole%2Fsms%2Fwhatsapp%2Fsandbox%3Fx-target-region%3Dus1&_ga=2.242177409.2074132245.1662993239-2142102272.1654536143&_gac=1.250351348.1659991013.CjwKCAjw6MKXBhA5EiwANWLODGQK44ev5iAgqDVzkMKJnWNcrNTMGDPZEYotk2gFMFWtZcZc0mTjRBoCGdMQAvD_BwE) and register the number you are using for testing. In the Sandbox Configuration section, paste the Function URL into the "WHEN A MESSAGE COMES IN" field.

5. If you haven't registered your WhatsApp number in the sandbox, do that now by following the instructions in the WhatsApp Participants section. For example, in the case below, you would send “join cloud-forgot” to the number +1 415 523 8886 from your WhatsApp.

6. Note that this registration is valid for 3 days and you will have to re-register after that period.

7. Save your settings.

8. You can now test the WhatsApp integration by sending a message from your WhatsApp to your Sandbox phone number.
