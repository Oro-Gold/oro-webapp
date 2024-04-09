import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Logo from "../Logo";
import dynamic from "next/dynamic";
import { PageTab } from "@/constants";
import { useRouter } from "next/router";

const WalletMultiButtonDynamic = dynamic(
    async () => (await import("../Wallet")).WalletMultiButton,
    { ssr: false },
  );
  
const Header = () => {
  
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<PageTab>(PageTab.Trade);

  const handleActiveTabChange = (newTab: PageTab) => {
    setActiveTab(newTab);
    if(newTab === PageTab.Lend) {
      router.push('/lend');
    }
    else if(newTab === PageTab.Trade) {
      router.push('/trade');
    }
  }

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
          <div className={styles.logo}>
              <Link href="/">
                  <Logo />
              </Link>
          </div>
          <div className={styles.tabButtonsContainer}>
            <div className={styles.tabButton}
              onClick={() => {
                handleActiveTabChange(PageTab.Trade)
              }}
              style={{
                color: activeTab === PageTab.Trade ? `white` : ``,
                backgroundColor: activeTab === PageTab.Trade ? `#1c1c1c` : ``,
                fontWeight: activeTab === PageTab.Trade ? `bold` : ``,
                padding: `0.5rem`,
                border: `none`,
                borderRadius: `0.25rem`
              }}
            >
              <span>Buy Gold</span>
            </div>
            <div className={styles.tabButton}
              onClick={() => {
                handleActiveTabChange(PageTab.Lend)
              }}
              style = {{
                color: activeTab === PageTab.Lend ? `white` : ``,
                backgroundColor: activeTab === PageTab.Lend ? `#1c1c1c` : ``,
                fontWeight: activeTab === PageTab.Lend ? `bold` : ``,
                padding: `0.5rem`,
                border: `none`,
                borderRadius: `0.25rem`
              }}
            >
              <span>Lend</span>
            </div>
          </div>
      </div>
      <div className={styles.actionButtonsContainer}>
        <div className={styles.walletButtonContainer}>
          <WalletMultiButtonDynamic />
        </div>
      </div>
    </div>
  );
}

export default Header;