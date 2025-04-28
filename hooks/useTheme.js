// hooks/useTheme.js

import { useSettings } from '../context/AppContext';
import { lightTheme, darkTheme } from '../constants/theme';

export default function useTheme() {
  const { isDarkMode } = useSettings();
  return isDarkMode ? darkTheme : lightTheme;
}
