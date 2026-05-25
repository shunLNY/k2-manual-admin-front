/** @format */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { stripHtml } from '@/utils/strip-html';

const secret = process.env.NEXTAUTH_SECRET;

type GenerateExcerptResponse = {
  description: string;
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateExcerptResponse | ErrorResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'OPENAI_API_KEY is not configured' });
  }

  const { content, title } = req.body as { content?: string; title?: string };
  const plainText = stripHtml(content || '');

  if (!plainText) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that writes concise Japanese article summaries (概要). ' +
              'Write 1-3 sentences in plain Japanese. Do not use markdown or bullet points. ' +
              'Maximum 500 characters.',
          },
          {
            role: 'user',
            content: [
              title ? `タイトル: ${title}` : null,
              `本文:\n${plainText.slice(0, 12000)}`,
            ]
              .filter(Boolean)
              .join('\n\n'),
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    });

    if (!openAiRes.ok) {
      const errBody = await openAiRes.text();
      console.error('OpenAI API error:', openAiRes.status, errBody);

      let message = 'Failed to generate excerpt';
      try {
        const parsed = JSON.parse(errBody) as {
          error?: { code?: string; message?: string };
        };
        const code = parsed.error?.code;
        const openAiMessage = parsed.error?.message;

        if (code === 'insufficient_quota') {
          message =
            'OpenAI credits are exhausted. Add billing at platform.openai.com/settings/billing';
        } else if (openAiRes.status === 401) {
          message = 'Invalid OPENAI_API_KEY. Check your API key in .env.local';
        } else if (openAiMessage) {
          message = openAiMessage;
        }
      } catch {
        // keep default message
      }

      return res.status(502).json({ message });
    }

    const data = await openAiRes.json();
    const description = (data.choices?.[0]?.message?.content || '').trim();

    if (!description) {
      return res.status(502).json({ message: 'Empty response from AI' });
    }

    return res.status(200).json({ description: description.slice(0, 500) });
  } catch (error) {
    console.error('generate-excerpt error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
