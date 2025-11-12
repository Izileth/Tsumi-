export const formatDate = (dateString: string | Date, cyber = false) => {
    if (!dateString) return '???';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '404//TIME_ERROR';

    const formatted = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);

    if (cyber)
        return `⧗ ${formatted.replace('.', '').toUpperCase()} ⧗`; 
    // Ex: "⧗ 12 NOV 2025 ⧗"

    return formatted;
};
