import { getBurntAmount } from '@/utils/getBurnAmount';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenName = searchParams.get('tokenName');

  try {
    if (!tokenName) {
      return new Response(JSON.stringify({ error: 'Token name is required' }), {
        status: 400,
      });
    }

    const burnt = await getBurntAmount(tokenName);
    
    return new Response(JSON.stringify({ burnt }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch burn amount' }), {
      status: 500,
    });
  }
}
