// import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/bootstrap.min.css';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { SWRConfig } from 'swr';
import { useEffect } from 'react';
import { SSRProvider } from 'react-bootstrap';
import RouteGuard from '@/components/RouteGuard';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap'); // add bootstrap js library
  }, []);

  return (
    <RouteGuard>
      <SSRProvider>
        <Layout>
          <SWRConfig
            value={{
              fetcher: async (url) => {
                const res = await fetch(url);

                // If the status code is not in the range 200-299,
                // we still try to parse and throw it.
                if (!res.ok) {
                  const error = new Error(
                    'An error occurred while fetching the data.'
                  );
                  // Attach extra info to the error object.
                  error.info = await res.json();
                  error.status = res.status;
                  throw error;
                }
                return res.json();
              },
            }}
          >
            <Component {...pageProps} />
          </SWRConfig>
        </Layout>
      </SSRProvider>
    </RouteGuard>
  );
}
