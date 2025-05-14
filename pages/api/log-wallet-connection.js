import { createClient } from '@supabase/supabase-js';

// Инициализация клиента Supabase
// Убедитесь, что переменные окружения установлены
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in environment variables for /api/log-wallet-connection.");
  // В реальном приложении лучше обрабатывать это более изящно, 
  // но для API эндпоинта выбрасывание ошибки на старте сервера может быть не лучшим решением.
  // Вместо этого, можно проверять их в самом хендлере.
}

// Инициализируем клиент только если есть URL и ключ
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default async function handler(req, res) {
  if (!supabase) {
    console.error("API Error: Supabase client not initialized. Check server logs for missing URL/Key.");
    return res.status(500).json({ error: "Supabase client not initialized. Administrator has been notified." });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { wallet_address } = req.body;

  if (!wallet_address) {
    return res.status(400).json({ error: "wallet_address is required in the request body." });
  }

  try {
    const { data, error, status, statusText } = await supabase
      .from('wallet_connections')
      .insert([
        { wallet_address: wallet_address },
        // connected_at будет добавлен автоматически базой данных
      ])
      .select(); // .select() чтобы вернуть вставленные данные

    if (error) {
      console.error("Supabase error inserting wallet connection:", { error, status, statusText });
      // Не отправляем детали ошибки клиенту из соображений безопасности, если это не ошибка валидации
      return res.status(status || 500).json({ error: `Database error: ${error.message || statusText}` });
    }

    console.log("Successfully logged wallet connection:", data);
    // Возвращаем 201 Created и вставленные данные (если select() был использован)
    // Или просто 200 OK / 204 No Content если данные не нужны клиенту
    return res.status(201).json({ message: "Wallet connection logged successfully.", entry: data });

  } catch (e) {
    console.error("Unexpected server error in /api/log-wallet-connection:", e);
    res.status(500).json({ error: `Server error: ${e.message}` });
  }
} 