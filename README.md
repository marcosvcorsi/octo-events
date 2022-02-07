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

-
-
- The repo you will integrate is: "improving/jaya-test"
  Use Basic Authentication with login: "xxx" and password: "xxx"
  Tip: You can use ngrok (​ https://ngrok.com/​ ) to install / debug the webhook calls, it generates a public
  url that will route to your local host:

Local
$ sudo ngrok http 4000

## Final Observations

-
-
- Use any library / framework / gem you want, you don't have to do anything "from scratch"
  Make tests, use your favorite framework for that
  Create a README.md with instructions to run the project
  Good luck and have fun :-)
