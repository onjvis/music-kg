import { Collection, Db, MongoClient } from 'mongodb';

export const collections: { users?: Collection } = {};

export const connectToDatabase = async (): Promise<void> => {
  const client: MongoClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING);

  await client.connect();

  const db: Db = client.db(process.env.MONGO_DB_NAME);

  const usersCollection: Collection = db.collection(process.env.MONGO_DB_COLLECTION);

  collections.users = usersCollection;

  console.log(
    `connectToDatabase: Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`
  );
};
