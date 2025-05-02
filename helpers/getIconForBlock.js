export default function getIconForBlock(label) {
    if (!label) return 'help-outline';
  
    const lower = label.toLowerCase();
  
    if (lower === 'before school') return 'time-outline';
    if (lower === 'zero period') return 'alarm-outline';
    if (lower.startsWith('period')) return 'book-outline';
    if (lower === 'break') return 'cafe-outline';
    if (lower === 'lunch') return 'restaurant-outline';
    if (lower === 'passing time') return 'walk-outline';
    if (lower === 'school closed') return 'home-outline';
    if (lower === 'no schedule listed') return 'calendar-outline';
  
    return 'help-outline';
  }
  