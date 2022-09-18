const {MongoClient} = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'eventDB';

async function main() {
    await client.connect();
    const db = client.db(dbName);
  }
  
  main()
    .then(console.log('db running'))
    .catch(console.error)

// module.exports = { database } ; 