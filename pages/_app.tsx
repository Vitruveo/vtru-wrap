import { VITRUVEO_CHAIN } from "../const/details";
import { ChakraProvider } from "@chakra-ui/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import '../styles/globals.css';
import '../components/CircuitBreaker.css';

export default function App({ Component, pageProps }: AppProps) {

  const [activeChain, setActiveChain] = useState(VITRUVEO_CHAIN);

  const handleChainSwitch:any = (chain:any) => {
    setActiveChain(chain);
  }

  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      activeChain={activeChain}
      supportedChains={[VITRUVEO_CHAIN]}
    >
      <ChakraProvider>
        <Component {...pageProps} chainSwitchHandler={handleChainSwitch} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}
