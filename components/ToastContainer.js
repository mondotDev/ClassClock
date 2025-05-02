// components/ToastContainer.js
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export default function ToastContainer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return visible ? <Toast /> : null;
}
