config = {
  port: process.env.PORT || 4000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'stevenkneiser',
    database: process.env.DB || 'postgres',
    password: process.env.DB_PASS || '',
    port: parseInt(process.env.DB_PORT) || 5432,
    max: parseInt(process.env.DB_MAX_CLIENTS) || 20,
    timeout: parseInt(process.env.DB_IDLE_TIMEOUT_MS) || 30000
  }    
}

module.exports = config;
