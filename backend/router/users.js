const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const { Client } = require('pg');
//const jwt = require('express-jwt');
// TODO: implement basic authentication

const config = require('../config')


const router = new express.Router();


// Verify 'users' table existence immediately on module import
(async () => {

  console.log(`💡 Verifying users table exists`);
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

    // Recreate users table schema if not found
    if (!response.rows[0].exists) {
      console.log(`❌ users table not found, but that's okay:\n💡 Creating a new users table from scratch`);
      const queryString = `
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name varchar(256) NOT NULL
        );
      `;

      await connection.query(queryString);
      console.log(`✅ users table created`);

    } else {
      console.log(`✅ users table found`);
    }


  } catch (e) {
    console.log(`❌ Cannot access nor create users table. Is PostGreSQL running in a seperate process & listening on localhost at port 5432?`);
    throw e;

  } finally {
    connection.end();
  }
})();



// Get all users (optional: filter by case-sensitive name)
router.get('/api/v0/users/?', async (req, res) => {
  console.info(`\n => 🌐 GET ${req.originalUrl}`);

  const name = req.query.name; // TODO: SANITIZE YOUR INPUTS
  const queryString = `SELECT * FROM users`
    + (name ? ` WHERE name LIKE '%${name}%';` : `;`); // TODO: SANITIZE YOUR INPUTS
  console.log(`💡 Fetching all users`
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

  const id = req.params.id; // TODO: SANITIZE YOUR INPUTS
  const queryString = `SELECT * FROM users WHERE id = ${id};`; // TODO: SANITIZE YOUR INPUTS
  console.log(`💡 Fetching id(${id})`);


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

  const name = req.body.name; // TODO: SANITIZE YOUR INPUTS
  if (!name) {
    console.warn(` <= ❌ Query Failure: invalid, empty name provided \n`);
    res.status(400).send({
      success: false,
      message: `name must be non-empty`,
    })
  }

  
  const queryString = `INSERT INTO users(name) VALUES ('${name}') RETURNING *;`; // TODO: SANITIZE YOUR INPUTS
  console.log(`💡 Adding user with name(${name})`);


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
