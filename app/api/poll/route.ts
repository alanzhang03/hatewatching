import { pollMatches } from '@/lib/poll';

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const result = await pollMatches();
    return Response.json(result);
  } catch (err) {
    console.error('Match poll failed:', err);
    return Response.json({ error: 'poll failed' }, { status: 500 });
  }
}
