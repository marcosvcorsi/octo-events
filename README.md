# Octo Events

Octo Events is an application that listens to Github Events via webhooks and expose by an api for later use.

The test consists in building 2 endpoints:

1. Webhook Endpoint
   The Webhook endpoint receives events from Github and saves them on the database, in order to do that you
   must read the following docs:

- Webhooks Overview: ​ https://developer.github.com/webhooks/
- Creating Webhooks : ​ https://developer.github.com/webhooks/creating/

2. Events Endpoint
   The Events endpoint will expose the persist the events by an api that will filter by issue number
   Request:
   GET /issues/1000/events
   Response:
   200 OK
   [
   { "action": "open", created_at: "...",},
   { "action": "closed", created_at: "...",}
   ]Github Integration Instructions

- Tip: You can use ngrok (​ https://ngrok.com/​ ) to install / debug the webhook calls, it generates a public
  url that will route to your local host:

Local
$ sudo ngrok http 4000
