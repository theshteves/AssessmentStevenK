const process = require('process');
const bodyParser = require('body-parser');
const express = require('express');
//const jwt = require('express-jwt');
// TODO: implement basic authentication & even SSO

const usersRoute = require('./router/users');
const messagesRoute = require('./router/messages')


const app = express();
const port = process.env.PORT || 4000;

// Parse requests of content-types: application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register API routes: /users & /messages
app.use(usersRoute);
app.use(messagesRoute);


app.get('/', async (req, res) => {
  res.send("👋 Welcome! <br /> Our API root endpoint is at <pre>http://localhost:4000/api/v0</pre>  <br /><br /> You have access to both /users & /messages (e.g. Retrieve all users at <a href=\"http://localhost:4000/api/v0/users\">http://localhost:4000/api/v0/users</a>)");
});



// Publish API at this port!
app.listen(port, async () => {
  console.log(`✅ Server is listening on port ${port}`);
});
