const jsforce = require("jsforce");
const express = require("express");
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const SF_CONSUMER_KEY = process.env.SF_CONSUMER_KEY || "";
const SF_CONSUMER_SECRET = process.env.SF_CONSUMER_SECRET || "";

let loginUrl = "https://login.salesforce.com";
const routePrefix = "";
var app = express();
const ROUTES = {
  AuthInitiate: routePrefix + "/auth2/initiate",
  AuthCallback: routePrefix + "/auth2/callback",
  Home: routePrefix + "/home",
  Root: routePrefix
};
var SF_REDIRECT_URI = ROUTES.AuthCallback;
const welcomePageHtml =
  `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
<div style="text-align: center;margin: 20px auto;" class="grid">
<div class="login-box--logo">
<svg height="26" viewBox="0 0 75 65" fill="var(--geist-foreground)"><title>Vercel Logo</title><path d="M37.59.25l36.95 64H.64l36.95-64z"></path></svg>
</div>


<h2>Salesforce Authenticator App</h2>
<div class="waves-effect waves-light">
<a class="waves-effect waves-light btn" href="` +
  ROUTES.AuthInitiate +
  `">Login to Production</a>
</div>
<div class="waves-effect waves-light">
<a class="waves-effect waves-light btn" href="` +
  ROUTES.AuthInitiate +
  `?issandbox=true">Login to Sandbox</a>
</div>
</div>`;

app.get(ROUTES.Home, function (req, res) {
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(welcomePageHtml));
});
app.get(ROUTES.Root, function (req, res) {
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(welcomePageHtml));
});
app.get(ROUTES.AuthInitiate, function (req, response) {
  if (!!req.query.issandbox) {
    loginUrl = "https://test.salesforce.com";
  }

  const oauth2 = new jsforce.OAuth2({
    clientId: SF_CONSUMER_KEY,
    clientSecret: SF_CONSUMER_SECRET,
    loginUrl: loginUrl,
    redirectUri: `${req.protocol}://${req.get("host")}${SF_REDIRECT_URI}`
  });
  let scope = {};
  let authUrl = oauth2.getAuthorizationUrl(scope);
  console.log(authUrl);
  const authorizeHtml =
    `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
<div style="text-align: center;margin: 20px auto;" class="grid">
<div class="login-box--logo">
<svg height="26" viewBox="0 0 75 65" fill="var(--geist-foreground)"><title>Logo</title><path d="M37.59.25l36.95 64H.64l36.95-64z"></path></svg>
</div>

<h2>Salesforce Authenticator App</h2>
<a class="waves-effect waves-light btn" href="` +
    authUrl +
    `">Continue</a>
</div>`;
  //response.redirect(authUrl);
  response.set("Content-Type", "text/html");
  response.send(Buffer.from(authorizeHtml));
});
app
  .get(ROUTES.AuthCallback, function (req, response) {
    const oauth2 = new jsforce.OAuth2({
      clientId: SF_CONSUMER_KEY,
      clientSecret: SF_CONSUMER_SECRET,
      loginUrl: loginUrl,
      redirectUri: `${req.protocol}://${req.get("host")}${SF_REDIRECT_URI}`
    });
    oauth2.requestToken(req.query.code, function (err, responseInfo) {
      if (err) {
        return console.error(err);
      }
      var messageHTML = "";
      console.log("REQUEST TOKEN responseInfo");
      console.log(responseInfo);
      if (!!responseInfo.refresh_token) {
        messageHTML = "GOT REFRESH TOKEN SUCCESSFULLY.\\n";
      } else {
        messageHTML = "REFRESH TOKEN NOT THERE.\\n";
      }
      response.set("Content-Type", "text/html");
      messageHTML += JSON.stringify(responseInfo);
      response.send(Buffer.from(messageHTML));
    });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
