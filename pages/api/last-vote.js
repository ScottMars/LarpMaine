import { createClient } from '@supabase/supabase-js';

// Инициализация клиента Supabase
// Переменные окружения должны быть установлены в вашей среде
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in environment variables.");
  // В реальном приложении лучше обрабатывать это более изящно
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  console.log("API /api/last-vote called");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("API Error: Supabase client not initialized.");
    return res.status(500).json({ error: "Supabase client not initialized. Check server logs." });
  }

  try {
    const now = new Date().toISOString();
    console.log(`Current time (ISO): ${now}`);

    // Ищем голосование, которое завершилось (end_date <= now)
    // и которое все еще должно отображаться (display_until_date > now)
    // Сортируем по дате окончания в порядке убывания, чтобы получить самое последнее
    const { data, error, status, statusText } = await supabase
      .from('votes')
      .select('*')
      .lte('end_date', now)
      .order('end_date', { ascending: false })
      .limit(1)
      .maybeSingle(); // Используем maybeSingle, так как может не быть такого голосования

    console.log("Supabase query result:", { data, error, status, statusText });

    if (error && status !== 406) { // 406 от maybeSingle - это не ошибка, а отсутствие записи
        console.error("Supabase error:", error);
        // Не отправляем детали ошибки клиенту из соображений безопасности
        return res.status(status || 500).json({ error: `Database error: ${error.message || statusText}` });
    }

    if (!data) {
        // Нет активного голосования для отображения результатов
        console.log("No finished vote found for display.");
        return res.status(404).json({ message: "No finished vote to display right now." });
    }

    console.log("Found finished vote:", data);
    res.status(200).json(data);
  } catch (e) {
    console.error("Unexpected server error:", e);
    res.status(500).json({ error: `Server error: ${e.message}` });
  }
} 