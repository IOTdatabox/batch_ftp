require('dotenv').config();
const ftp = require('ftp');
const fs = require('fs');
const path = require('path');
const fastcsv = require('fast-csv');
const cron = require('node-cron');
const crypto = require('crypto');

const hashEmail = (email) => {
  return crypto.createHash('sha1').update(email).digest('hex').toUpperCase();
};

const getSignUps = async () => {
  // Replace with actual database query
  return [
    {
      CampaignId: 30923,
      ActionTrackerId: 53272, // Fixed for Wine Club Sign Up
      EventDate: new Date().toISOString(), // ISO-8601 format
      ClickId: 'clickidvalue123',
      OrderId: 'O-123456789',
      CustomerId: 'CID-123456789',
      CustomerEmail: hashEmail('customer1@example.com'),
    },
    {
      CampaignId: 30923,
      ActionTrackerId: 53272,
      EventDate: new Date().toISOString(),
      ClickId: 'clickidvalue456',
      OrderId: 'O-123456790',
      CustomerId: 'CID-123456790',
      CustomerEmail: hashEmail('customer2@example.com'),
    },
  ];
};

const generateCSV = async () => {
  const signups = await getSignUps();
  const filePath = path.join(__dirname, 'impact_signups.csv');

  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filePath);
    fastcsv
      .write(signups, { headers: true })
      .pipe(ws)
      .on('finish', () => resolve(filePath))
      .on('error', reject);
  });
};

const uploadToFTP = async (filePath) => {
  const client = new ftp();

  client.on('ready', () => {
    console.log('client is ready.');
    client.put(filePath, 'impact_signups.csv', (err) => {
      if (err) throw err;
      console.log('✅ File uploaded successfully!');
      client.end();
    });
  });

  client.connect({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    port: process.env.FTP_PORT,
  });
};

cron.schedule('*/10 * * * * *', async () => {
  console.log('📤 Generating and uploading Impact.com CSV...');
  try {
    const filePath = await generateCSV();
    await uploadToFTP(filePath);
  } catch (error) {
    console.error('❌ Error:', error);
  }
});
