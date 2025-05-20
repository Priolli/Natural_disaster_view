import { Handler } from '@netlify/functions';
import axios from 'axios';

const GDACS_RSS_URL = 'https://gdacs.org/xml/rss.xml';

const handler: Handler = async (event) => {
  try {
    const response = await axios.get(GDACS_RSS_URL);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: response.data,
    };
  } catch (error) {
    console.error('Error fetching GDACS data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch GDACS data' }),
    };
  }
};

export { handler };