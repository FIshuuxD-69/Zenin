export const formatReadStatus = (status) => {
    if (!status) return 'Unknown';
    // Capitalize first letter logic if needed, or simply return
    return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 5) return 'text-yellow-400';
    return 'text-red-400';
};
