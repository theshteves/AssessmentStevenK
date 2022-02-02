const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const { Client } = require('pg');
//const jwt = require('express-jwt');
// TODO: implement basic authentication

const config = require('../config')


const router = new express.Router();


// Verify 'users' table existence immediately on module import
(async () => {

  console.info(`💡 Verifying users table exists`);
  const tableQueryString = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'users'
    );
  `;


  const connection = new Client(config.db);
  try {
    connection.connect();
    const response = await connection.query(tableQueryString);

    // Recreate users table from schema if not found
    if (!response.rows[0].exists) {
      console.warn(`❌ users table not found, but that's okay:\n💡 Creating a new users table from scratch`);
      const queryString = `
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name varchar(256) NOT NULL
        );
      `;

      await connection.query(queryString);
      console.info(`✅ users table created`);

    } else {
      console.info(`✅ users table found`);
    }


  } catch (e) {
    console.warn(`❌ Cannot access nor create users table. Is PostGreSQL running in a seperate process & listening on localhost at port ${config.db.port}?`);
    throw e;

  } finally {
    connection.end();
  }
})();



// Get all users (optional: filter by case-sensitive name)
router.get('/api/v0/users/?', async (req, res) => {
  console.info(`\n => 🌐 GET ${req.originalUrl}`);

  const { name } = req.query; // TODO: SANITIZE YOUR INPUTS
  const queryString = `SELECT * FROM users`
    + (name ? ` WHERE name LIKE '%${name}%';` : `;`); // TODO: SANITIZE YOUR INPUTS
  console.info(`💡 Fetching all users`
    + (name ? ` with name(${name})` : ``));


  const connection = new Client(config.db);
  try {
    connection.connect();
    const response = await connection.query(queryString); // TODO: SANITIZE YOUR INPUTS

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



// Get user by id
router.get('/api/v0/users/:id', async (req, res) => {
  console.info(`\n => 🌐 GET ${req.originalUrl}`);

  const { id } = req.params; // TODO: SANITIZE YOUR INPUTS
  const queryString = `SELECT * FROM users WHERE id = ${id};`; // TODO: SANITIZE YOUR INPUTS
  console.info(`💡 Fetching id(${id})`);


  const connection = new Client(config.db);
  try {
    connection.connect();
    const response = await connection.query(queryString); // TODO: SANITIZE YOUR INPUTS

    // Did id search come back empty?
    if (response.rows > 0) {
      console.info(` <= ✅ Query Success: ${response.rows.length} rows returned`);
      res.status(200).send({
        success: true,
        result: response.rows[0],
      });

    } else {
      console.warn(` <= ❌ Query Failure: id(${id}) not found \n`);
      res.status(404).send({
          success: false,
          message: `id #{id} not found`,
      });
    }


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



// Insert user via name (max 256 characters)
router.post('/api/v0/users/?', async (req, res) => {
  console.info(`\n => 🌐 POST ${req.originalUrl}`);

  const { name } = req.body; // TODO: SANITIZE YOUR INPUTS
  if (!name) {
    console.warn(` <= ❌ Query Failure: invalid, empty name provided \n`);
    res.status(400).send({
      success: false,
      message: `parameter "name" must be non-empty (try double-checking your spelling)`,
    })
  }

  // TODO: add 4xx error for name > 256 characters
  
  const queryString = `INSERT INTO users(name) VALUES ('${name}') RETURNING *;`; // TODO: SANITIZE YOUR INPUTS
  console.info(`💡 Adding user with name(${name})`);


  const connection = new Client(config.db);
  try {
    connection.connect();
    const response = await connection.query(queryString); // TODO: SANITIZE YOUR INPUTS

    res.status(200).send({
        success: true,
        result: response.rows[0],
    });
    console.info(` <= ✅ Query Success: user added, with name(${name}) at id(${response.rows[0].id})`);


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



// TODO: Update user name by id
//router.put('/api/v0/users/:id'



// TODO: Delete user by name
//router.delete('/api/v0/users/?'



module.exports = router;
