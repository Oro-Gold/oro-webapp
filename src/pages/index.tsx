import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    // Redirect to the /market/[address] route with the default address
    router.replace(`/trade`);
  }, [router]);


  return (
    <div className={styles.appContainer}>
      <main>
      </main>
    </div>
  );
}
