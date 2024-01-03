import { config } from 'dotenv';
config();

export const secretConfig = {
  encriptionKey :process.env.ENCRYPTION_KEY
};