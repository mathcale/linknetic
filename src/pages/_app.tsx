import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import { UserContextProvider } from '../hooks/auth-user.hook';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider
      themes={[process.env.NEXT_PUBLIC_LIGHT_THEME_NAME, process.env.NEXT_PUBLIC_DARK_THEME_NAME]}
      defaultTheme={process.env.NEXT_PUBLIC_LIGHT_THEME_NAME}
      enableSystem={false}
    >
      <UserContextProvider>
        <Component {...pageProps} />
        <Toaster />
      </UserContextProvider>
    </ThemeProvider>
  );
}
