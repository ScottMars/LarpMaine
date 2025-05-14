import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('[API Route] Initializing Supabase client...'); // Лог инициализации
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[API Route] Error: Supabase URL or Anon Key is missing from environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('[API Route] Supabase client initialized.');

export default async function handler(req, res) {
    console.log(`[API Route] Received request: ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { after } = req.query;
    console.log(`[API Route] Parameter 'after': ${after}`);

    try {
        let query = supabase
            .from('votes')
            .select('*')
            .order('start_date', { ascending: true })
            .limit(1);

        if (after) {
            const afterDate = new Date(after);
            if (isNaN(afterDate.getTime())) {
                console.error(`[API Route] Invalid 'after' date format: ${after}`);
                return res.status(400).json({ message: "Invalid 'after' date format." });
            }
            const isoAfterDate = afterDate.toISOString();
            console.log(`[API Route] Querying votes starting after: ${isoAfterDate}`);
            query = query.gt('start_date', isoAfterDate);
        } else {
            const nowISO = new Date().toISOString();
            console.log(`[API Route] Querying first vote with end_date >= ${nowISO}`);
            query = query.gte('end_date', nowISO);
        }

        console.log('[API Route] Executing Supabase query...');
        const { data, error, status } = await query.single(); // Добавили status для информации

        console.log(`[API Route] Supabase query finished. Status: ${status}, Error: ${error ? JSON.stringify(error) : 'null'}, Data: ${data ? JSON.stringify(data) : 'null'}`);

        // Проверяем ошибку Supabase БОЛЕЕ ДЕТАЛЬНО
        if (error && error.code !== 'PGRST116') { // PGRST116 - "No rows found" - не считаем ошибкой для .single()
            console.error('[API Route] Supabase query error:', JSON.stringify(error, null, 2)); // Логируем полную ошибку
            // Не выбрасываем ошибку здесь, а возвращаем 500
            return res.status(500).json({ message: 'Error fetching vote data from Supabase', details: error.message });
        }

        if (!data) {
            console.log('[API Route] No vote data found.');
            return res.status(200).json({});
        }

        console.log('[API Route] Vote data found, sending response.');
        return res.status(200).json(data);

    } catch (err) {
        // Ловим ЛЮБЫЕ другие ошибки в процессе выполнения
        console.error('[API Route] Internal Server Error in handler:', err); // Логируем полную ошибку
        return res.status(500).json({ message: 'Internal Server Error', details: err.message });
    }
} 