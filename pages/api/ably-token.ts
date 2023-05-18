import { NextApiRequest, NextApiResponse } from 'next';
import { Realtime } from 'ably';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const realtime = new Realtime({ key: process.env.ABLY_API_KEY});
    const tokenParams = { clientId: req.query.rnd };
    const tokenRequest = await new Promise((resolve, reject) => {
      realtime.auth.createTokenRequest(tokenParams, null, (err, tokenRequest) => {
        if (err) {
          reject(err);
        } else {
          resolve(tokenRequest);
        }
      });
    });
    res.status(200).json(tokenRequest);
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}