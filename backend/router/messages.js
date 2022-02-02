const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const { Client } = require('pg');
//const jwt = require('express-jwt');
// TODO: implement basic authentication

const config = require('../config')


const router = new express.Router();


// Verify 'messages' table existence immediately on module import
(async () => {

  console.info(`💡 Verifying messages table exists`);
  const tableQueryString = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'messages'
    );
  `;


  const connection = new Client(config.db);
  try {
    connection.connect();
    const response = await connection.query(tableQueryString);

    // Recreate messages table from schema if not found
    if (!response.rows[0].exists) {
      console.warn(`❌ messages table not found, but that's okay:\n💡 Creating a new messages table from scratch`);
      const queryString = `
        CREATE TABLE messages (
          id BIGSERIAL PRIMARY KEY,
          sender_id INT,
          recipient_id INT,
          content varchar(2048) NOT NULL,
          CONSTRAINT fk_sender FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE SET NULL,
          CONSTRAINT fk_recipient FOREIGN KEY(recipient_id) REFERENCES users(id) ON DELETE SET NULL
        );
      `;

      await connection.query(queryString);
      console.info(`✅ messages table created`);

    } else {
      console.info(`✅ messages table found`);
    }


  } catch (e) {
    console.warn(`❌ Cannot access nor create messages table. Is PostGreSQL running in a seperate process & listening on localhost at port ${config.db.port}?`);
    throw e;

  } finally {
    connection.end();
  }
})();



// Get all messages
router.get('/api/v0/messages/?', async (req, res) => {
  console.info(`\n => 🌐 GET ${req.originalUrl}`);

  const queryString = `
    SELECT messages.*, senders.name as sender_name, recipients.name as recipient_name
    FROM messages
    INNER JOIN users as senders ON messages.sender_id = senders.id
    INNER JOIN users as recipients ON messages.recipient_id = recipients.id;
  `; //TODO: doesn't matter at demo stage, but I think there's more room to optimize this query (e.g. with only 1 users table lookup)
  console.info(`💡 Fetching all messages`);


  const connection = new Client(config.db);
  try {
    connection.connect();
    const response = await connection.query(queryString);

    res.status(200).send({
      success: true,
      result: response.rows,
    });
    console.info(` <= ✅ Query Success: ${response.rows.length} rows returned`);


  } catch (e) {
    console.warn(` <= ❌ Query Failure: See database logs\n`);
    res.status(500).send({
        success: false
    });
    throw e;

  } finally {
    connection.end();
  }
});


// Insert message (max 2048 characters)
router.post('/api/v0/messages/?', async (req, res) => {
  console.info(`\n => 🌐 POST ${req.originalUrl}`);

  let { sender, recipient, content } = req.body; // TODO: SANITIZE YOUR INPUTS

  if (!sender || !recipient || !content) {
    console.warn(` <= ❌ Query Failure: request missing parameters (e.g. sender, recipient, & content) \n`);
    res.status(400).send({
      success: false,
      message: `parameters "sender", "recipient", & "content" must be non-empty (try double-checking your spelling)`,
    })
  }

  // TODO: add 4xx error for content > 2048 characters
  content = content.replace(/'/gim, `\\\'`); // Escape the single-quotes for PostGres (still should be sanitized instead)
  content = content.slice(0, 2048); // silently truncate until I have time to handle this thoroughly

  const queryString = `INSERT INTO messages(sender_id, recipient_id, content) VALUES (${sender}, ${recipient}, E'${content}') RETURNING *;`; // TODO: SANITIZE YOUR INPUTS
  console.info(`💡 Adding message with sender(${sender}), recipient(${recipient}), & content(${content})`);


  const connection = new Client(config.db);
  try {
    connection.connect();
    const response = await connection.query(queryString); // TODO: SANITIZE YOUR INPUTS

    res.status(200).send({
        success: true,
        result: response.rows[0],
    });
    console.info(` <= ✅ Query Success: message added, with sender(${sender}), recipient(${recipient}), & content(${content}) at id(${response.rows[0].id})`);


  } catch (e) {
    console.warn(` <= ❌ Query Failure: See database logs\n`);
    res.status(500).send({
        success: false,
    });
    throw e;

  } finally {
    connection.end();
  }
});


module.exports = router
