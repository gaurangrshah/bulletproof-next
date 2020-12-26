import { ChakraProvider } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";
import { Provider } from "next-auth/client";

import theme from "@/chakra";
import { ToastProvider } from "@/chakra/contexts/toast-context";
import DefaultLayout from "@/chakra/layouts/default";

import Nprogress from "@/components/nprogress";
import SEO from "../next-seo.config";

const App = ({ Component, pageProps }) => {
  // console.log(theme)
  return (
    <>
      <DefaultSeo {...SEO} />
      <ChakraProvider resetCSS theme={theme}>
        <Nprogress />
        <ToastProvider>
          <Provider>
            <DefaultLayout config={{ headerShow: true, footerShow: true }}>
              <Component {...pageProps} />
            </DefaultLayout>
          </Provider>
        </ToastProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
