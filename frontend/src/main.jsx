import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './index.css';

import { MantineProvider } from '@mantine/core';
import { useLocalStorage, useHotkeys } from '@mantine/hooks';
import { AuthProvider } from './context/AuthContext';
import { listenForTokenRefresh } from './utils/auth';
import './i18n'; // i18n 多语言支持初始化

function MainWrapper() {
  // 支持暗色/亮色切换，并缓存到本地
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  // 快捷键：Cmd/Ctrl + J 切换主题
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme,
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  );
}

listenForTokenRefresh();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainWrapper />
  </React.StrictMode>
);
