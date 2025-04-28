// Конфигурация Supabase
const SUPABASE_URL = 'https://hzhmdreyyomrusasyrcg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aG1kcmV5eW9tcnVzYXN5cmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NTQwMDAsImV4cCI6MjAzMTUzMDAwMH0.VHxPNvp1Qk4XF9oVL8kXqgZ9H0l_9BHXpqKG1USRCns';

// Инициализация Supabase клиента
function initSupabase() {
    return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Экспорт для использования в других файлах
const supabaseClient = initSupabase(); 