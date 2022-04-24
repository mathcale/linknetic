import { UserContextProvider } from '../hooks/auth-user.hook';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}
