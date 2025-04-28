-- Таблица для хранения голосований (объединенная)
CREATE TABLE IF NOT EXISTS votings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voting_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    no_option_image_url TEXT NOT NULL,
    no_option_label TEXT NOT NULL,
    yes_option_image_url TEXT NOT NULL,
    yes_option_label TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для хранения голосов
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voting_id TEXT NOT NULL REFERENCES votings(voting_id),
    is_yes_vote BOOLEAN NOT NULL,
    user_id TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS votings_voting_id_idx ON votings(voting_id);
CREATE INDEX IF NOT EXISTS votes_voting_id_idx ON votes(voting_id);
CREATE INDEX IF NOT EXISTS votes_is_yes_vote_idx ON votes(is_yes_vote);

-- Функция для подсчета голосов
CREATE OR REPLACE FUNCTION get_vote_count(voting_id_param TEXT)
RETURNS TABLE (is_yes BOOLEAN, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT v.is_yes_vote, COUNT(*) as count
    FROM votes v
    WHERE v.voting_id = voting_id_param
    GROUP BY v.is_yes_vote;
END;
$$ LANGUAGE plpgsql; 