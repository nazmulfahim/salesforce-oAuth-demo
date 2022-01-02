# salesforce-oauth-demo
* This app is a simple UI to generate a refresh token for your Salesforce org so that later that refresh token can be used to generate an access token(like a session id) to talk to Salesforce.

## Create a connected app in your SF org
* for testing you can create it in any dev/sandbox org
* Go to Salesforce Setup -> Type _App Manager_ -> Click on _New Connected App_ on top right section.
* Fill out the details like following screenshot.
    * ![Connected App](./create-connected-app.png?raw=true "Connected App")
* Create it.
* Now you should be able to see 2 keys. copy these for later use
    * Consumer Key
    * Consumer Secret

## Setup Environment variables in this Demo app code.
* ```PORT=5001```
* ```SF_CONSUMER_SECRET='<Consumer Secret>'```
* ```SF_CONSUMER_KEY='<Consumer Key>'```

## Run this app
* ```npm i```
* ```node index.js```
* Click on _Login to Sandbox_ first for testing in Sandbox. Steps are same for prod as well.
* It will redirect you to SF login page where you need to login.
* After this it will redirect you back to your demo app and give you a JSON String.
* Find **refresh_token** from this json string and keep it for further use.