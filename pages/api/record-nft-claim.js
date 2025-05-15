import { createClient } from '@supabase/supabase-js';

// Инициализация клиента Supabase
// Убедитесь, что переменные окружения установлены правильно
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Check .env.local or environment variables.');
}
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default async function handler(req, res) {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized.' });
  }

  if (req.method === 'POST') {
    const { wallet_address } = req.body;

    if (!wallet_address || typeof wallet_address !== 'string' || wallet_address.trim() === '') {
      return res.status(400).json({ error: 'Wallet address is required and must be a non-empty string.' });
    }

    // Опционально: базовая валидация длины адреса Solana (обычно 32-44 символа в base58)
    // Это не полная валидация, а лишь грубая проверка. Для полной валидации нужны специальные библиотеки.
    if (wallet_address.length < 32 || wallet_address.length > 44) {
        // Можно вернуть ошибку или просто предупреждение, если формат критичен
        // return res.status(400).json({ error: 'Invalid wallet address format (length check).' });
        console.warn(`Received wallet address with unusual length: ${wallet_address.length}`);
    }

    try {
      const { data, error, status } = await supabase
        .from('nft_claim_wallets') // Используем имя таблицы, созданное ранее
        .insert([{ wallet_address: wallet_address.trim() }])
        .select(); // select() чтобы вернуть вставленные данные

      if (error) {
        console.error('Supabase error inserting wallet address:', error);
        // Проверка на уникальность (код ошибки 23505 для PostgreSQL)
        if (error.code === '23505') {
          return res.status(409).json({ error: 'This wallet address has already been recorded.', code: error.code });
        }
        return res.status(status || 500).json({ error: error.message || 'Failed to record wallet address.' });
      }

      console.log('Successfully recorded wallet address:', data);
      return res.status(201).json({ message: 'Wallet address recorded successfully!', data });
    } catch (e) {
      console.error('Catch block error inserting wallet address:', e);
      return res.status(500).json({ error: e.message || 'An unexpected error occurred.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 