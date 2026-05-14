import type { NextApiRequest, NextApiResponse } from 'next';
import type { ServerResponse } from 'http';
import { getToken } from 'next-auth/jwt';
import httpProxy from 'http-proxy';
import { API_URL } from '../../../utils/constants';

const secret = process.env.NEXTAUTH_SECRET;

const proxy = httpProxy.createProxyServer({
  target: API_URL,
  autoRewrite: false,
  xfwd: true,
  secure: process.env.ENVIRONMENT === 'production',
  changeOrigin: true,
});

const nextProxy = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const token = await getToken({ req, secret });

  return new Promise<void>((resolve, reject) => {
    // Remove /api/proxy prefix
    req.url = req.url?.replace('/api/proxy', '') || '';

    // Remove host header
    delete req.headers.host;

    // Do not forward cookies
    req.headers.cookie = '';

    // Custom header
    req.headers['x-device-type'] = 'pc';

    // Add Authorization header if token exists
    if (token && token.accessToken) {
      req.headers.authorization = `Bearer ${token.accessToken}`;
    }

    // Handle proxy errors
    proxy.once('error', (err, _req, proxyRes) => {
      if ('writeHead' in proxyRes) {
        const serverRes = proxyRes as ServerResponse;

        serverRes.writeHead(503, {
          'Content-Type': 'application/json',
        });

        serverRes.end(
          JSON.stringify({
            status: 503,
            message: 'Error in connection to API Service',
          }),
        );
      }

      reject(err);
    });

    // Resolve when proxy response finishes
    proxy.once('proxyRes', () => {
      resolve();
    });

    // Forward request
    proxy.web(req, res);
  });
};

export default nextProxy;

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};