
const themeColors = {
  Romance: '#FA1F63',
  'Conflict Resolution': '#33DEA5',
  // ... other themes
};

export const getThemeColor = (theme: keyof typeof themeColors | string) => {
  return themeColors[theme as keyof typeof themeColors] || '#FFFFFF';
};
