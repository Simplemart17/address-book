import { Client } from 'cassandra-driver'
import getConfig from 'next/config'

const {
  publicRuntimeConfig: { CLIENT_ID, CLIENT_SECRET },
} = getConfig();

const client = new Client({
  cloud: {
    secureConnectBundle: 'secure-connect-multi-database.zip',
  },
  credentials: {
    username: CLIENT_ID,
    password: CLIENT_SECRET,
  },
});

// async () => {
//   try {
//     await client.connect();
//     console.log('Database connected successfully');
//     await client.shutdown();
//   } catch (error) {
//     console.log('Error connecting to the database: ' + error);
//   }
// }

export { client }
