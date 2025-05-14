import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[API Route /api/submit-vote] Error: Supabase URL or Anon Key is missing.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MAX_VOTES_PER_USER = 5;

export default async function handler(req, res) {
    console.log(`[API Route /api/submit-vote] Received request: ${req.method} ${req.url}`);

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { vote_id, wallet_address, choice } = req.body;

    console.log(`[API Route /api/submit-vote] Payload: vote_id=${vote_id}, wallet_address=${wallet_address}, choice=${choice}`);

    if (!vote_id || !wallet_address || !choice) {
        return res.status(400).json({ message: 'Missing required fields: vote_id, wallet_address, choice' });
    }

    if (choice !== 'yes' && choice !== 'no') {
        return res.status(400).json({ message: "Invalid choice value. Must be 'yes' or 'no'." });
    }

    try {
        // 1. Проверить, сколько раз пользователь уже голосовал за это голосование
        console.log(`[API Route /api/submit-vote] Checking existing votes for wallet ${wallet_address} and vote_id ${vote_id}`);
        const { data: existingVotes, error: countError, count } = await supabase
            .from('user_votes')
            .select('*', { count: 'exact', head: true }) // Используем head:true для получения только count
            .eq('vote_id', vote_id)
            .eq('wallet_address', wallet_address);

        if (countError) {
            console.error('[API Route /api/submit-vote] Supabase error counting votes:', countError);
            return res.status(500).json({ message: 'Error counting user votes', details: countError.message });
        }
        
        const userVoteCount = count || 0;
        console.log(`[API Route /api/submit-vote] User has ${userVoteCount} votes for this poll.`);

        if (userVoteCount >= MAX_VOTES_PER_USER) {
            console.log(`[API Route /api/submit-vote] User ${wallet_address} has reached the vote limit for vote_id ${vote_id}`);
            return res.status(403).json({ message: 'Vote limit reached for this poll.', current_votes: userVoteCount, max_votes: MAX_VOTES_PER_USER });
        }

        // 2. Записать голос в user_votes
        console.log(`[API Route /api/submit-vote] Inserting new vote for wallet ${wallet_address}, vote_id ${vote_id}`);
        const { error: insertVoteError } = await supabase
            .from('user_votes')
            .insert([{ vote_id, wallet_address }]);

        if (insertVoteError) {
            console.error('[API Route /api/submit-vote] Supabase error inserting vote:', insertVoteError);
            return res.status(500).json({ message: 'Error saving user vote', details: insertVoteError.message });
        }

        // 3. Обновить счетчик в таблице votes
        // Сначала получаем текущее значение, чтобы избежать гонки состояний, если возможно
        // Однако, Supabase предоставляет атомарные операции инкремента через rpc или можно просто обновить
        // Для простоты, просто инкрементируем.
        const columnToIncrement = choice === 'yes' ? 'choices_yes' : 'choices_no';
        console.log(`[API Route /api/submit-vote] Incrementing ${columnToIncrement} for vote_id ${vote_id}`);
        
        // Получаем текущее значение голосов
        const { data: currentVoteData, error: getCurrentVoteError } = await supabase
            .from('votes')
            .select(columnToIncrement)
            .eq('id', vote_id)
            .single();

        if (getCurrentVoteError) {
            console.error('[API Route /api/submit-vote] Supabase error fetching current vote count:', getCurrentVoteError);
            // Можно попытаться откатить запись в user_votes, но это усложнит логику
            return res.status(500).json({ message: 'Error fetching current vote count for update', details: getCurrentVoteError.message });
        }

        if (!currentVoteData) {
             console.error(`[API Route /api/submit-vote] Vote with id ${vote_id} not found for incrementing.`);
             return res.status(404).json({ message: `Vote with id ${vote_id} not found.` });
        }

        const newCount = (currentVoteData[columnToIncrement] || 0) + 1;

        const { error: updateCountError } = await supabase
            .from('votes')
            .update({ [columnToIncrement]: newCount })
            .eq('id', vote_id);
            
        if (updateCountError) {
            console.error('[API Route /api/submit-vote] Supabase error updating vote count:', updateCountError);
            // Здесь также можно было бы откатить запись в user_votes
            return res.status(500).json({ message: 'Error updating vote count', details: updateCountError.message });
        }

        console.log(`[API Route /api/submit-vote] Vote successfully recorded for ${wallet_address}, vote_id ${vote_id}, choice ${choice}. New total votes: ${userVoteCount + 1}`);
        return res.status(200).json({ message: 'Vote recorded successfully', new_total_user_votes: userVoteCount + 1, max_votes: MAX_VOTES_PER_USER });

    } catch (err) {
        console.error('[API Route /api/submit-vote] Internal Server Error in handler:', err);
        return res.status(500).json({ message: 'Internal Server Error', details: err.message });
    }
} 