import type { AppProps } from "next/app";
import Head from "next/head";
import type { FC } from "react";
import React, { useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";

import { WalletModalProvider } from "../components/Wallet";
import { Analytics } from '@vercel/analytics/react';

const Header = dynamic(
  async () => (await import("../components/Header")),
  { ssr: false },
);

import dynamic from "next/dynamic";

// Use require instead of import since order matters
// require("bootstrap/dist/css/bootstrap.min.css");
require("../styles/wallet.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

  const wallets = useMemo(
    () => [
    ],
    [],
  );

  return (
    <>
      <Head>
        <title>Oro Gold - The best tokenized Gold products on Solana</title>
        <link rel="icon" href="/images/oro-gold.png" />
        <meta property="og:title" content="Oro Gold" />
        <meta property="og:description" content="Building the best gold products on Solana" />
      </Head>

      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
              <Header />
              <Component {...pageProps} />
              <div>
                <Analytics />
              </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
        integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        rel="stylesheet"
      />
    </>
  );
};

export default App;
