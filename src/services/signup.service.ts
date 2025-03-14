import crypto from 'crypto';
import * as fastcsv from 'fast-csv';
import ftp from 'ftp';
import fs from 'fs';
import { IBatchType, IFile } from '../types/batch.type';

export const hashEmail = (email: string) => {
  return crypto.createHash('sha1').update(email).digest('hex').toUpperCase();
};

export const generateCSV = async (signup: IBatchType) => {
  const { ClickId } = signup;
  const filename = `${ClickId}-${Date.now()}`;
  const filepath = `public/csv/${filename}`;

  if (!fs.existsSync('public/csv')) {
    fs.mkdirSync('public/csv', { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filepath);
    fastcsv
      .write([signup], { headers: true })
      .pipe(ws)
      .on('finish', () => resolve({ filename, filepath }))
      .on('error', reject);
  });
};

export const uploadToFTP = async (info: IFile) => {
  const client = new ftp();

  client.on('ready', () => {
    console.log('client is ready.');
    client.put(info.filepath, info.filename, (err) => {
      if (err) throw err;
      console.log('✅ File uploaded successfully!');
      client.end();
    });
  });

  client.connect({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    port: parseInt(process.env.FTP_PORT as string),
  });
};
