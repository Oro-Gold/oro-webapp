import React, { useEffect, useState } from "react";
import styles from "./OroTradeContainer.module.css";
import { Timescale, TradeButton } from "@/constants";
import Trade from "../..";
import Image from "next/image";
import { Form } from "react-bootstrap";
import { delay, makeApiRequest } from "@/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN, Wallet, web3 } from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import { AUTHORITY, TOKEN_MINT } from "@/constants/addresses";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export interface OroTradeContainerProps {
    isActionLoading: boolean;
    setIsActionLoading: React.Dispatch<React.SetStateAction<boolean>>;
    havePurchased: boolean;
    setHavePurchased: React.Dispatch<React.SetStateAction<boolean>>;
}

const OroTradeContainer = ({
    isActionLoading,
    setIsActionLoading,
    havePurchased,
    setHavePurchased
}: OroTradeContainerProps) => {
    
    const [selectedTradeButton, setSelectedTradeButton] = useState<TradeButton>(TradeButton.Buy);

    const [inputAmount, setInputAmount] = useState<string>("0");
    
    const [outputAmount, setOutputAmount] = useState<string>("0");

    const [priceSeries, setPriceSeries] = useState<any>([]);

    useEffect(() => {        
        const fetchData = async() => {
            const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;
            const headers = {
                "X-API-KEY": BIRDEYE_API_KEY,
                "x-chain": "ethereum"
            }

            const currentTimestamp = parseInt((Date.now() / 1_000).toString());
            
            let fromTimestamp = currentTimestamp - 60;

            const response = await makeApiRequest(`defi/history_price?address=0x68749665FF8D2d112Fa859AA293F07A622782F38&address_type=token&type=1m&time_from=${fromTimestamp}&time_to=${currentTimestamp}`, headers);
            setPriceSeries(_ => response.data.items)
        }

        fetchData();
    }, [inputAmount]);

    const handleInputAmountChange = (newVal) => {
        setInputAmount(_ => newVal);

        if(newVal && newVal.length > 0) {
            const inputValFloat = parseFloat(newVal);
            let latestPrice = 0;
            if(priceSeries && priceSeries.length > 0) {
                latestPrice = priceSeries[0]["value"];
            }

            let outputValFloat = 0;

            if(selectedTradeButton === TradeButton.Buy) {
                outputValFloat = inputValFloat / latestPrice;
            }
            else {
                outputValFloat = inputValFloat * latestPrice;
            }

            setOutputAmount(_ => outputValFloat.toFixed(4));
        }
        else {
            setOutputAmount(_ => "");
        }
    }

    const wallet = useWallet();
    const connection = useConnection();

    const [purchasedOro, setPurchasedOro] = useState<string>("21");
    const [purchaseSig, setPurchasedSig] = useState<string>("");

    const handleTrade = async () => {
        if(wallet && wallet.connected) {
            setIsActionLoading(true);
        await delay(3_000);
        try {
            const transaction = new web3.Transaction();
            const mintIx = spl.createMintToInstruction(
                TOKEN_MINT,
                wallet.publicKey,
                AUTHORITY,
                (new BN(parseInt(outputAmount))).mul(new BN(10**9)),
            );
            transaction.add(mintIx);
            const conn = new web3.Connection("https://api.devnet.solana.com");

            const {
                context: { slot: minContextSlot },
                value: { blockhash, lastValidBlockHeight },
              } = await conn.getLatestBlockhashAndContext();

            transaction.recentBlockhash = blockhash;
            transaction.feePayer = AUTHORITY;
            const keypair = web3.Keypair.fromSecretKey(Buffer.from(process.env.PRIVATE_KEY, 'base64'));
            transaction.partialSign(keypair);
            
            const signature = await wallet.sendTransaction(transaction, conn, { skipPreflight: true })
            await delay(2_000);
            setPurchasedSig(_ => signature);
        }
        catch(err) {
        }
        await delay(2_000);
        setHavePurchased(_ => true);
        setPurchasedOro(_ => outputAmount);
        setIsActionLoading(false);
        }
    }

    useEffect(() => {
        const updateBalance = async () => {
            try {
                
            }
            catch(err) {
                console.log("Error updating balance for the user: ", err);
            }
        }

        updateBalance();
    }, [wallet, connection]);

    return (
        <div
            className={styles.oroTradeContainer}
        >
            <div className={styles.oroGoldTradeTitleContainer}
            style={{
                opacity: isActionLoading || havePurchased ? `0.1` : ``
            }}
            >
                Invest in GOLD for as low as 1 USD
            </div>
            <div className={styles.oroTradeBoxContainer}
                style={{
                    opacity: isActionLoading || havePurchased ? `0.1` : ``
                }}
            >
                <div className={styles.tradeButtonsContainer}>
                    <div
                        className={styles.tradeButton}
                        style = {{
                            color: selectedTradeButton === TradeButton.Buy ? `#ffce71` : ``,
                            fontWeight: selectedTradeButton === TradeButton.Buy ? `bold` : ``
                        }}
                        onClick={() => {
                            setSelectedTradeButton(_ => TradeButton.Buy)
                        }}
                    >
                        Buy ORO
                    </div>
                    <div
                        className={styles.tradeButton}
                        style = {{
                            color: selectedTradeButton === TradeButton.Withdraw ? `#ffce71` : ``,
                            fontWeight: selectedTradeButton === TradeButton.Withdraw ? `bold` : ``
                        }}
                        onClick={() => {
                            setSelectedTradeButton(_ => TradeButton.Withdraw)
                        }}
                    >
                        Withdraw
                    </div>
                </div>
                <div className={styles.tokenBoxContainer}>
                    <div className={styles.tokenBoxOne}>
                        <div className={styles.tokenBoxTitleContainer}>
                            You pay
                        </div>
                        {
                            selectedTradeButton === TradeButton.Buy ?
                                <div className={styles.formFieldAndTokenInfoContainer}>
                                    <div className={styles.formFieldContainer}>
                                        <Form.Group controlId="formInput">
                                            <Form.Control
                                                placeholder={`0`}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    fontSize: "2rem",
                                                    fontWeight: "bold",
                                                    textAlign: "left",
                                                    color: "#ddd",
                                                    border: "none",
                                                    caretColor: "#ddd",
                                                    paddingTop: "1rem",
                                                    paddingBottom: "1rem",
                                                }}
                                                min="0"
                                                step="0.01"
                                                onChange={(e) => handleInputAmountChange(e.target.value)}
                                                value={inputAmount} // Use inputText instead of inputAmount to show the decimal value
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className={styles.formTokenInfoContainer}>
                                        <div className={styles.formTokenImage}>
                                            <Image
                                                src="/images/usdc.png"
                                                alt="Logo"
                                                width={30}
                                                height={30}
                                                style={{
                                                    height: "auto",
                                                    maxWidth: "200px",
                                                }}
                                            />
                                        </div>
                                        <div className={styles.formTokenName}>
                                            <span>USD</span>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className={styles.formFieldAndTokenInfoContainer}>
                                    <div className={styles.formFieldContainer}>
                                        <Form.Group controlId="formInput">
                                            <Form.Control
                                                placeholder={`0`}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    fontSize: "2rem",
                                                    fontWeight: "bold",
                                                    textAlign: "left",
                                                    color: "#ddd",
                                                    border: "none",
                                                    caretColor: "#ddd",
                                                    paddingTop: "1rem",
                                                    paddingBottom: "1rem",
                                                }}
                                                min="0"
                                                step="0.01"
                                                onChange={(e) => handleInputAmountChange(e.target.value)}
                                                value={inputAmount} // Use inputText instead of inputAmount to show the decimal value
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className={styles.formTokenInfoContainer}>
                                        <div className={styles.formTokenImage}>
                                            <Image
                                                src="/images/oro-gold.svg"
                                                alt="Logo"
                                                width={72}
                                                height={72}
                                                style={{
                                                    height: "auto",
                                                    maxWidth: "200px",
                                                }}
                                            />
                                        </div>
                                        <div className={styles.formTokenName}>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                    <div className={styles.arrowContainer}>
                        <Image
                            src="/images/Arrow.svg"
                            alt="Logo"
                            width={20}
                            height={10}
                            style={{
                                height: "auto",
                                maxWidth: "200px",
                            }}
                        />
                    </div>
                    <div className={styles.tokenBoxTwo}>
                        <div className={styles.tokenBoxTitleContainer}>
                            You receive
                        </div>
                        {
                            selectedTradeButton === TradeButton.Buy ?
                                <div className={styles.formFieldAndTokenInfoContainer}>
                                    <div className={styles.formFieldContainer}>
                                        <Form.Group controlId="formInput">
                                            <Form.Label
                                                style={{
                                                    backgroundColor: "transparent",
                                                    fontSize: "2rem",
                                                    fontWeight: "bold",
                                                    textAlign: "left",
                                                    color: "#ddd",
                                                    border: "none",
                                                    caretColor: "#ddd",
                                                    paddingTop: "1rem",
                                                    paddingBottom: "1rem",
                                                }}
                                            >
                                                {
                                                    outputAmount
                                                }
                                            </Form.Label>
                                        </Form.Group>
                                    </div>
                                    <div className={styles.formTokenInfoContainer}>
                                        <div className={styles.formTokenImage}>
                                            <Image
                                                src="/images/oro-gold.svg"
                                                alt="Logo"
                                                width={72}
                                                height={72}
                                                style={{
                                                    height: "auto",
                                                    maxWidth: "200px",
                                                }}
                                            />
                                        </div>
                                        <div className={styles.formTokenName}>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>                         
                            :
                                <div className={styles.formFieldAndTokenInfoContainer}>
                                    <div className={styles.formFieldContainer}>
                                        <Form.Group controlId="formInput">
                                            <Form.Label
                                                style={{
                                                    backgroundColor: "transparent",
                                                    fontSize: "2rem",
                                                    fontWeight: "bold",
                                                    textAlign: "left",
                                                    color: "#ddd",
                                                    border: "none",
                                                    caretColor: "#ddd",
                                                    paddingTop: "1rem",
                                                    paddingBottom: "1rem",
                                                }}
                                            >
                                                {
                                                    outputAmount
                                                }
                                            </Form.Label>
                                        </Form.Group>
                                    </div>
                                    <div className={styles.formTokenInfoContainer}>
                                        <div className={styles.formTokenImage}>
                                            <Image
                                                src="/images/usdc.png"
                                                alt="Logo"
                                                width={30}
                                                height={30}
                                                style={{
                                                    height: "auto",
                                                    maxWidth: "200px",
                                                }}
                                            />
                                        </div>
                                        <div className={styles.formTokenName}>
                                            <span>USD</span>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
                <div
                    className={styles.actionButtonContainer}
                    style={{
                        color: inputAmount && inputAmount.length > 0 ? `#000`: `#999`,
                        fontWeight: inputAmount && inputAmount.length > 0 ? `bold`: `bold`,
                    }}
                    onClick={() => {
                        handleTrade()
                    }}
                >
                    {
                        inputAmount && inputAmount.length > 0 ?
                            selectedTradeButton === TradeButton.Buy ?
                                `Purchase ORO`
                            :
                                `Withdraw USD`
                        :
                            `ENTER AMOUNT`
                    }
                </div>
                <div className={styles.nullSpace}>

                </div>
            </div>
            <div
                className={styles.actionModal}
                style = {{
                    display: isActionLoading ? `` : `none`
                }}
            >
                <div className={styles.spinnerBox}>
                    <div
                        className={styles.threeQuarterSpinner}
                        style={{
                            border: "3px solid #ffce71",
                            borderTop: `3px solid transparent`,
                        }}
                    ></div>
                </div>
                <div className={styles.approvalWaitText}>
                    Waiting for transaction approval
                </div>
                <div className={styles.approvalHelpText}>
                    Please go to your wallet and approve the transaction to continue
                </div>

                <div className={styles.secureTransactionNote}>
                    <div className={styles.securityLogo}>
                        <Image
                            src="/images/Shield.svg"
                            alt="Logo"
                            width={20}
                            height={20}
                            style={{
                                height: "auto",
                                maxWidth: "200px",
                            }}
                        />
                    </div>
                    <div className={styles.securityText}>
                        <span>All your transactions are 100% safe</span>
                    </div>
                </div>
            </div>
            <div
                className={styles.havePurchasedModal}
                style = {{
                    display: havePurchased ? `` : `none`,
                    opacity: `1.0`
                }}
            >
                <div className={styles.closeHavePurchasedButtonContainer}
                    onClick={() => {
                        setHavePurchased(_ => false);
                        setOutputAmount(_ => "");
                        setInputAmount(_ => "");
                    }}
                >
                    <div className={styles.closeHavePurchasedButton}>
                        <span>
                            <i className="fa-solid fa-xmark"></i>
                        </span>
                    </div>
                </div>
                <div className={styles.oroLogoContainer}>
                    <span>
                        <i className="fa-regular fa-circle-check"></i>
                    </span>
                </div>
                <div className={styles.purchasedOroText}>
                    <h1>{purchasedOro} ORO</h1>
                </div>
                <div className={styles.purchaseText}>
                    Wow! It only took a couple of seconds to invest into gold with ORO
                </div>
                <div className={styles.purchaseInfoContainer}>
                    <div className={styles.purchaseInfoTitle}>
                        <span>Amount Invested</span>
                    </div>
                    <div className={styles.purchaseInfo}>
                        <span>{inputAmount}</span>
                    </div>
                </div>
                <div className={styles.purchaseInfoContainer}>
                    <div className={styles.purchaseInfoTitle}>
                        <span>Transaction</span>
                    </div>
                    <div className={styles.purchaseInfo}>
                        <a href={`https://solscan.io/tx/${purchaseSig}?cluster=devnet`} target="_blank"><span>{purchaseSig.substring(0, 4)}<i className="fa-solid fa-arrow-up-right-from-square"></i></span></a>
                    </div>
                </div>
                <div className={styles.continueButton}
                    onClick={() => {
                        setHavePurchased(_ => false);
                        setOutputAmount(_ => "");
                        setInputAmount(_ => "");
                    }}
                >
                    Continue
                </div>
            </div>
        </div>
    )
}

export default OroTradeContainer;