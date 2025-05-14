import { createClient } from '@supabase/supabase-js';

// Инициализация клиента Supabase (предполагается, что переменные окружения установлены)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in environment variables for /api/vote/[voteId].");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  const { voteId } = req.query; // Получаем voteId из URL query

  console.log(`API /api/vote/${voteId} called`);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("API Error: Supabase client not initialized.");
    return res.status(500).json({ error: "Supabase client not initialized. Check server logs." });
  }

  if (!voteId) {
    return res.status(400).json({ error: "Vote ID is required." });
  }

  try {
    // Ищем голосование по его ID
    const { data, error, status, statusText } = await supabase
      .from('votes') // Убедитесь, что таблица называется 'votes'
      .select('*') // Выбираем все поля (или укажите нужные)
      .eq('id', voteId) // Фильтруем по id
      .maybeSingle(); // Используем maybeSingle, так как голосование с таким ID может не существовать

    console.log(`Supabase query result for voteId ${voteId}:`, { data, error, status, statusText });

    // 406 от maybeSingle - это не ошибка, а отсутствие записи
    if (error && status !== 406) { 
      console.error(`Supabase error fetching voteId ${voteId}:`, error);
      return res.status(status || 500).json({ error: `Database error: ${error.message || statusText}` });
    }

    if (!data) {
      // Голосование с таким ID не найдено
      console.log(`Vote with ID ${voteId} not found.`);
      return res.status(404).json({ message: `Vote with ID ${voteId} not found.` });
    }

    // Голосование найдено, возвращаем его данные
    console.log(`Found vote data for ID ${voteId}:`, data);
    res.status(200).json(data);

  } catch (e) {
    console.error(`Unexpected server error for voteId ${voteId}:`, e);
    res.status(500).json({ error: `Server error: ${e.message}` });
  }
} 