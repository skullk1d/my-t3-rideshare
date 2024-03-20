import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';
import ActiveUserWrapper from '~/context/ActiveUser';
import '~/styles/globals.css';
import { api } from '~/utils/api';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`font-sans ${inter.variable}`}>
      <ActiveUserWrapper>
        <Component {...pageProps} />
      </ActiveUserWrapper>
    </main>
  );
};

export default api.withTRPC(MyApp);
