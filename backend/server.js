const process = require('process');
const bodyParser = require('body-parser');
const express = require('express');
//const jwt = require('express-jwt');
// TODO: implement basic authentication & even SSO

const config = require('./config')
const usersRoute = require('./router/users');
const messagesRoute = require('./router/messages')


const app = express();

// Parse requests of content-types: application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register API routes: /users & /messages
app.use(usersRoute);
app.use(messagesRoute);


app.get('/', async (req, res) => {
  res.send([
    `👋 Welcome! <br /> Our API root endpoint is at <pre>http://localhost:4000/api/v0</pre>  `,
    `You have access to both /users & /messages. Here's some ideas:`,
    `Retrieve all users: <a href=\"http://localhost:4000/api/v0/users\">http://localhost:4000/api/v0/users</a>`,
    `Retrieve all messages: <a href=\"http://localhost:4000/api/v0/messages\">http://localhost:4000/api/v0/messages</a>`,
  ].join(`<br /><br />`));
});



// Publish API at this port!
app.listen(config.port, async () => {
  console.log(`✅ Server is listening on port ${config.port}`);
});
