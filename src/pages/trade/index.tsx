import React, { useState } from "react";
import styles from "./Trade.module.css";
import OroInfoContainer from "./components/OroInfoContainer";
import OroTradeContainer from "./components/OroTradeContainer";

const Trade = () => {
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
    const [havePurchased, setHavePurchased] = useState<boolean>(false);

    return (
        <div className={styles.tradePageContainer}
        >
            <div className={styles.oroInfoContainer}
                        style={{
                            opacity: isActionLoading || havePurchased ? `0.1` : ``
                        }}
            
            >
                <OroInfoContainer />
            </div>
            <div className={styles.oroTradeContainer}>
                <OroTradeContainer isActionLoading={isActionLoading} havePurchased={havePurchased} setIsActionLoading={setIsActionLoading} setHavePurchased={setHavePurchased}/>
            </div>
        </div>
    )
}

export default Trade;