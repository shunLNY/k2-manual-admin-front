import type { NextApiRequest, NextApiResponse } from 'next';
import { API_URL } from '@/utils/constants';

export const config = {
  api: {
    bodyParser: false, // Handle multipart/form-data and other bodies manually
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const path = Array.isArray(slug) ? slug.join('/') : slug;
  
  // Construct the target URL
  const queryPart = req.url?.includes('?') ? '?' + req.url.split('?')[1] : '';
  const url = `${API_URL}/${path}${queryPart}`;

  console.log(`[Proxy] ${req.method} ${req.url} -> ${url}`);

  try {
    // Forward the request to the backend
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers as any,
        host: new URL(API_URL).host,
      },
      // Pass the request body stream directly for POST/PUT/PATCH
      body: req.method !== 'GET' && req.method !== 'HEAD' ? (req as any) : undefined,
      // @ts-ignore - Duplex is required when body is a stream in some environments
      duplex: 'half',
    });

    // Copy response headers
    response.headers.forEach((value, key) => {
      // Skip some headers that shouldn't be forwarded
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.status(response.status);

    // Stream the response body back
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    console.error('[Proxy Error]', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
