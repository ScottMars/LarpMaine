// API для работы с голосованиями
class VotingAPI {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    // Получить текущее активное голосование
    async getCurrentVoting() {
        const now = new Date();
        
        const { data, error } = await this.supabase
            .from('votings')
            .select('*')
            .gt('end_time', now.toISOString())
            .order('end_time', { ascending: true })
            .limit(1)
            .single();
            
        if (error) {
            console.error('Ошибка при получении голосования:', error);
            return null;
        }
        
        return data;
    }
    
    // Получить количество голосов для голосования
    async getVoteCounts(votingId) {
        const { data, error } = await this.supabase
            .rpc('get_vote_count', { voting_id_param: votingId });
            
        if (error) {
            console.error('Ошибка при получении подсчета голосов:', error);
            return { yes: 0, no: 0 };
        }
        
        // Преобразуем результат в удобный формат
        let yesVotes = 0;
        let noVotes = 0;
        
        data.forEach(row => {
            if (row.is_yes) {
                yesVotes = parseInt(row.count);
            } else {
                noVotes = parseInt(row.count);
            }
        });
        
        return { yes: yesVotes, no: noVotes };
    }
    
    // Создать новое голосование
    async createVoting(title, endTime, noOptionImageUrl, noOptionLabel, yesOptionImageUrl, yesOptionLabel) {
        const votingId = Date.now().toString();
        
        // Создаем запись голосования
        const { error } = await this.supabase
            .from('votings')
            .insert([
                { 
                    voting_id: votingId,
                    title, 
                    end_time: new Date(endTime).toISOString(),
                    no_option_image_url: noOptionImageUrl,
                    no_option_label: noOptionLabel,
                    yes_option_image_url: yesOptionImageUrl,
                    yes_option_label: yesOptionLabel
                }
            ]);
            
        if (error) {
            console.error('Ошибка при создании голосования:', error);
            return null;
        }
        
        return votingId;
    }
    
    // Проголосовать за вариант
    async vote(votingId, isYesVote, userId = null) {
        const ipAddress = await this.getIpAddress();
        
        // Проверяем, не голосовал ли пользователь ранее
        const { data: existingVotes, error: checkError } = await this.supabase
            .from('votes')
            .select('id')
            .match({ 
                voting_id: votingId, 
                ip_address: ipAddress 
            })
            .limit(1);
            
        if (checkError) {
            console.error('Ошибка при проверке существующих голосов:', checkError);
            return false;
        }
        
        if (existingVotes && existingVotes.length > 0) {
            console.warn('Пользователь уже голосовал');
            return false;
        }
        
        // Добавляем голос
        const { error: voteError } = await this.supabase
            .from('votes')
            .insert([
                { 
                    voting_id: votingId, 
                    is_yes_vote: isYesVote,
                    user_id: userId,
                    ip_address: ipAddress
                }
            ]);
            
        if (voteError) {
            console.error('Ошибка при голосовании:', voteError);
            return false;
        }
        
        return true;
    }
    
    // Получить IP-адрес пользователя для предотвращения повторного голосования
    async getIpAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Ошибка при получении IP-адреса:', error);
            return 'unknown';
        }
    }
}

// Экспорт класса API
const votingAPI = new VotingAPI(supabaseClient); 