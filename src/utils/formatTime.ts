export const formatDuration = (minutes: number) => {
    if (!minutes) return '—';
    if (minutes < 60) return `${minutes} мин`;
    return `${Math.floor(minutes / 60)} ч ${minutes % 60} мин`;
};