// constants/theme.js

export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#1B5C9E',
    secondary: '#FFD700',
    border: '#CCCCCC',
    card: '#F5F5F5',
    thumb: '#FFFFFF', // <- Add this for switches in light mode
  },
  fontFamily: 'Roboto',
};

export const darkTheme = {
  colors: {
    background: '#121212',
    text: '#FFFFFF',
    primary: '#1B5C9E',
    secondary: '#FFD700',
    border: '#333333',
    card: '#1E1E1E',
    thumb: '#BBBBBB', // <- Lighter gray for better dark mode contrast
  },
  fontFamily: 'Roboto',
};
