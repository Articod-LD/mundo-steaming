import "@/styles/globals.css";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnimatePresence } from "framer-motion";
import DefaultSeo from "@/layouts/_default-seo";
import { ThemeProvider } from "next-themes";

import type { AppProps } from "next/app";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { NextPageWithLayout } from "@/types";
import dynamic from "next/dynamic";
import "@fontsource-variable/oswald";
import { UIProvider } from "@/contexts/ui.context";
import { ModalProvider } from "@/components/ui/modal/modal.context";
import ManagedModal from "@/components/ui/modal/managed-modal";

const PrivateRoute = dynamic(() => import("@/layouts/_private-route"), {
  ssr: false,
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());

  const authenticationRequired = Component.authorization ?? false;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <UIProvider>
            <ModalProvider>
              <AnimatePresence
                initial={false}
                onExitComplete={() => window.scrollTo(0, 0)}
              >
                <>
                  <DefaultSeo />
                  {authenticationRequired ? (
                    <PrivateRoute>
                      {getLayout(<Component {...pageProps} />)}
                    </PrivateRoute>
                  ) : (
                    getLayout(<Component {...pageProps} />)
                  )}
                </>
                <ManagedModal />
                <Toaster containerClassName="!top-16 sm:!top-3.5 !bottom-16 sm:!bottom-3.5" />
              </AnimatePresence>
            </ModalProvider>
          </UIProvider>
        </ThemeProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
