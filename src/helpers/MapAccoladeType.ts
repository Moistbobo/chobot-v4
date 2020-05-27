const MapAccoladeType = (type: string) => {
    if (type === 'medal') return '🎖';
    if (type === 'ribbon') return '🎗';
    if (type === 'collectible') return '🌟';
    return '';
};

export default MapAccoladeType;
