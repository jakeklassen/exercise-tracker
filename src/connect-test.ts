import mongoose from 'mongoose';

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
