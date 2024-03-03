import { ObjectId } from 'mongodb';

export type User = {
  id: ObjectId;
  email: string;
  hash: string;
};
