import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('[API Route /api/next-vote] Initializing Supabase client...');
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[API Route /api/next-vote] Error: Supabase URL or Anon Key is missing from environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('[API Route /api/next-vote] Supabase client initialized.');

const MAX_VOTES_PER_USER = 5; // Определяем здесь, чтобы использовать при расчете оставшихся голосов

export default async function handler(req, res) {
    console.log(`[API Route /api/next-vote] Received request: ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { after, wallet_address } = req.query; // Добавляем wallet_address
    console.log(`[API Route /api/next-vote] Parameters: 'after': ${after}, 'wallet_address': ${wallet_address}`);

    try {
        let query = supabase
            .from('votes')
            .select('*')
            .order('start_date', { ascending: true })
            .limit(1);

        if (after) {
            const afterDate = new Date(after);
            if (isNaN(afterDate.getTime())) {
                console.error(`[API Route /api/next-vote] Invalid 'after' date format: ${after}`);
                return res.status(400).json({ message: "Invalid 'after' date format." });
            }
            const isoAfterDate = afterDate.toISOString();
            console.log(`[API Route /api/next-vote] Querying votes starting after: ${isoAfterDate}`);
            query = query.gt('start_date', isoAfterDate);
        } else {
            const nowISO = new Date().toISOString();
            console.log(`[API Route /api/next-vote] Querying first vote with end_date >= ${nowISO}`);
            query = query.gte('end_date', nowISO);
        }

        console.log('[API Route /api/next-vote] Executing Supabase query for vote data...');
        const { data: voteData, error: voteError, status: voteStatus } = await query.single();

        console.log(`[API Route /api/next-vote] Supabase vote query finished. Status: ${voteStatus}, Error: ${voteError ? JSON.stringify(voteError) : 'null'}, Data: ${voteData ? JSON.stringify(voteData) : 'null'}`);

        if (voteError && voteError.code !== 'PGRST116') {
            console.error('[API Route /api/next-vote] Supabase query error fetching vote:', JSON.stringify(voteError, null, 2));
            return res.status(500).json({ message: 'Error fetching vote data from Supabase', details: voteError.message });
        }

        if (!voteData) {
            console.log('[API Route /api/next-vote] No vote data found.');
            return res.status(200).json({}); // Возвращаем пустой объект, если нет активных голосований
        }

        let userVoteCount = 0;
        let remainingVotes = MAX_VOTES_PER_USER;

        if (wallet_address) {
            console.log(`[API Route /api/next-vote] Wallet address provided: ${wallet_address}. Fetching user vote count for vote_id: ${voteData.id}`);
            const { count, error: countError } = await supabase
                .from('user_votes')
                .select('*', { count: 'exact', head: true })
                .eq('vote_id', voteData.id)
                .eq('wallet_address', wallet_address);

            if (countError) {
                console.error('[API Route /api/next-vote] Supabase error counting user votes:', countError);
                // Не блокируем ответ из-за этой ошибки, просто пользователь не увидит кол-во своих голосов
            } else {
                userVoteCount = count || 0;
                remainingVotes = MAX_VOTES_PER_USER - userVoteCount;
            }
            console.log(`[API Route /api/next-vote] User ${wallet_address} has ${userVoteCount} votes for poll ${voteData.id}. Remaining: ${remainingVotes}`);
        }

        const responseData = {
            ...voteData,
            user_vote_count: userVoteCount,
            remaining_votes: remainingVotes,
            max_votes_per_user: MAX_VOTES_PER_USER
        };

        console.log('[API Route /api/next-vote] Vote data (with user vote count) found, sending response:', responseData);
        return res.status(200).json(responseData);

    } catch (err) {
        console.error('[API Route /api/next-vote] Internal Server Error in handler:', err);
        return res.status(500).json({ message: 'Internal Server Error', details: err.message });
    }
} 