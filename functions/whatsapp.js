/* Handles WhatsApp messages by
 * 1. Creating a conversation
 * 2. Adding the participant that sent that message
 * 3. Adding the message to the conversation
 * If any of these fail, the conversation is deleted
 */
exports.handler = async function (context, event, callback) {
  const isConfigured = context.STUDIO_FLOW_SID
  const response = new Twilio.Response()
  response.appendHeader('Access-Control-Allow-Origin', '*')
  response.appendHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  response.appendHeader('Content-Type', 'application/json')
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type')

  console.log(`Received Event: ${JSON.stringify(event)}`)

  if (!isConfigured) {
    response.setBody({
      status: 500,
      message: 'Studio Flow SID is not configured'
    })
    callback(null, response)
    return
  }

  const client = context.getTwilioClient()

  let conversation
  const webhookConfiguration = {
    target: 'studio',
    'configuration.flowSid': context.STUDIO_FLOW_SID,
    'configuration.replayAfter': 0,
    'configuration.filters': ['onMessageAdded']
  }

  try {
    conversation = await client.conversations.conversations.create({
      xTwilioWebhookEnabled: true
    })
    console.log(`Created Conversation with sid ${conversation.sid}`)
    try {
      console.log(`Adding studio webhook to conversation ${conversation.sid}`)
      await client.conversations
        .conversations(conversation.sid)
        .webhooks.create(webhookConfiguration)
    } catch (error) {
      console.log(`Got error when configuring webhook ${error}`)
      response.setStatusCode(500)
      return callback(error, response)
    }
  } catch (error) {
    console.log(`Couldnt create conversation ${error}`)
    return callback(error)
  }

  try {
    await client.conversations
      .conversations(conversation.sid)
      .participants.create({
        'messagingBinding.address': `${event.From}`,
        'messagingBinding.proxyAddress': `${event.To}`
      })
    console.log(`Added Participant successfully to conversation`)
  } catch (error) {
    console.log(`Failed to add Participant to conversation, ${error}`)
    try {
      await client.conversations.conversations(conversation.sid).remove()
      console.log('Deleted conversation successfully')
    } catch (error) {
      console.log(`Failed to remove conversation, ${error}`)
    }
    return callback(null, '')
  }

  // Now add the message to the conversation
  try {
    const body =
      event.Body !== ''
        ? event.Body
        : 'Empty body, maybe an attachment. Sorry this function doesnt support adding media to the conversation. This should work post private beta'
    console.log(`Setting body to ${body}`)
    await client.conversations.conversations(conversation.sid).messages.create({
      author: `${event.From}`,
      body: `${body}`,
      xTwilioWebhookEnabled: true
    })
    console.log(`Added message successfully to conversation`)
  } catch (error) {
    console.log(`Failed to add message to conversation, ${error}`)
    try {
      await client.conversations.conversations(conversation.sid).remove()
    } catch (error) {
      console.log(`Failed to remove conversation, ${error}`)
    }
    return callback(null, `${error}`)
  }

  return callback(null, '')
}
