import mongoose from 'mongoose';
import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'localhost',
  user: 'sidequest',
  password: 'elephant',
  database: 'sidequest',
  port: 5432,
});
await client.connect();
console.log('Connected to Postgres');

await client.query('SELECT NOW()');
await client.end();

const connection = await mongoose
  .createConnection('mongodb://mongo:27017', {
    user: 'tantor',
    pass: 'elephant',
    dbName: 'tantor-test',
    authSource: 'admin',
  })
  .asPromise()
  .catch(async (error) => {
    console.error(error);

    console.log('attempt 1 failed');

    return mongoose
      .createConnection('mongodb://localhost:27017', {
        user: 'tantor',
        pass: 'elephant',
        dbName: 'tantor-test',
        authSource: 'admin',
      })
      .asPromise();
  });

console.log('connected');

await connection.close();

await mongoose.disconnect();
