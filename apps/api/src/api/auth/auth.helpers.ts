import { sign, SignOptions } from 'jsonwebtoken';
import { randomBytes, scryptSync } from 'node:crypto';

import { UserPayload } from './auth.models';

const ENCODING_HEX = 'hex';
const KEYLEN = 64;
const SALT_LEN = 16;

export const encryptPassword = (password: string): string => {
  const salt: string = randomBytes(SALT_LEN).toString(ENCODING_HEX);
  const key: string = hashPassword(password, salt);

  return [salt, key].join(':');
};

export const generateAccessToken = (payload: UserPayload): string => {
  const options: SignOptions = { expiresIn: process.env.JWT_EXPIRATION_TIME };
  return sign(payload, process.env.JWT_SECRET, options);
};

export const validatePassword = (hash: string, password: string): boolean => {
  const splitHash: string[] = hash?.split(':');
  const salt: string = splitHash?.[0];
  const key: string = splitHash?.[1];

  return key === hashPassword(password, salt);
};

const hashPassword = (password: string, salt: string): string =>
  scryptSync(password, salt, KEYLEN).toString(ENCODING_HEX);
