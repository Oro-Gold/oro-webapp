import React, { useEffect, useState } from "react";
import styles from "./OroInfoContainer.module.css";
import { makeApiRequest } from "@/utils";
import OroChart from "../OroChartContainer";
import { Timescale, getTimescaleText } from "@/constants";
import Image from "next/image";

const OroInfoContainer = () => {

    const [priceSeries, setPriceSeries] = useState<any>([]);

    const [selectedTimescale, setSelectedTimescale] = useState<Timescale>(Timescale.Month); 

    useEffect(() => {        
        const fetchData = async() => {
            const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;
            const headers = {
                "X-API-KEY": BIRDEYE_API_KEY,
                "x-chain": "ethereum"
            }

            const currentTimestamp = parseInt((Date.now() / 1_000).toString());
            
            let fromTimestamp = currentTimestamp;

            if(selectedTimescale === Timescale.Hour) {
                fromTimestamp = currentTimestamp - (60 * 60);
            }
            else if(selectedTimescale === Timescale.Day) {
                fromTimestamp = currentTimestamp - (24 * 60 * 60);
            }
            else if(selectedTimescale === Timescale.Month) {
                fromTimestamp = currentTimestamp - (30 * 24 * 60 * 60);
            }
            else if(selectedTimescale === Timescale.Quarter) {
                fromTimestamp = currentTimestamp - (3 * 30 * 24 * 60 * 60);
            }
            else if(selectedTimescale === Timescale.Year) {
                fromTimestamp = currentTimestamp - (365 * 24 * 60 * 60);
            }

            let duration = "1m";

            if(selectedTimescale === Timescale.Day) {
                duration = "15m";
            }
            if(selectedTimescale === Timescale.Month) {
                duration = "1H";
            }
            else if(selectedTimescale === Timescale.Quarter) {
                duration = "12H"
            }
            else if(selectedTimescale === Timescale.Year) {
                duration = "1D"
            }

            if(fromTimestamp === currentTimestamp) {
                fromTimestamp -= 3600;
            }

            const response = await makeApiRequest(`defi/history_price?address=0x68749665FF8D2d112Fa859AA293F07A622782F38&address_type=token&type=${duration}&time_from=${fromTimestamp}&time_to=${currentTimestamp}`, headers);

            setPriceSeries(_ => response.data.items)
        }

        fetchData();
    }, [selectedTimescale]);

    return (
        <div className={styles.oroInfoContainer}>
            <div className={styles.oroGoldHeaderContainer}>
                <div className={styles.oroGoldNameAndPriceContainer}>
                    <div className={styles.oroGoldNameContainer}>
                        <span className={styles.oroGoldName}>ORO Gold</span>
                    </div>
                    <div className={styles.oroGoldPriceContainer}>
                        <span className={styles.oroGoldPrice}>
                            {
                                priceSeries && priceSeries.length > 0 ?
                                    `$ ${parseFloat(priceSeries[0]["value"]).toFixed(2)}`
                                :
                                    `2290.12`
                            }
                        </span>
                    </div>
                </div>
                <div className={styles.oroGoldDailyChangeContainer}>
                    <div className={styles.oroGoldDailyChange}>
                        {
                            `+211.72 (+36.53%) `
                        }
                    </div>
                    <div className={styles.oroGoldDailyChangeTitle}>
                        {
                            ` Past 1 day`
                        }
                    </div>
                </div>
            </div>
            <div className={styles.oroGoldChartContainer}>
                <OroChart series = {
                    priceSeries && priceSeries.length > 0 ?
                        priceSeries.map((val) => val["value"])
                    :
                        []
                    } 
                />
            </div>
            <div className={styles.chartTimescaleContainer}>
                <div
                    className={styles.chartTimescaleOption}
                    style = {{
                        fontWeight: selectedTimescale === Timescale.Hour ? `bold` : ``,
                        color: selectedTimescale === Timescale.Hour ? `white` : `#999`,
                        backgroundColor: selectedTimescale === Timescale.Hour ? `#111` : ``,
                    }}
                    onClick={() => {
                        setSelectedTimescale(_ => Timescale.Hour)
                    }}
                >
                    {
                        getTimescaleText(Timescale.Hour)
                    }
                </div>
                <div
                    className={styles.chartTimescaleOption}
                    style = {{
                        fontWeight: selectedTimescale === Timescale.Day ? `bold` : ``,
                        color: selectedTimescale === Timescale.Day ? `white` : `#999`,
                        backgroundColor: selectedTimescale === Timescale.Day ? `#111` : ``,
                    }}
                    onClick={() => {
                        setSelectedTimescale(_ => Timescale.Day)
                    }}
                >
                    {
                        getTimescaleText(Timescale.Day)
                    }
                </div>
                <div
                    className={styles.chartTimescaleOption}
                    style = {{
                        fontWeight: selectedTimescale === Timescale.Month ? `bold` : ``,
                        color: selectedTimescale === Timescale.Month ? `white` : `#999`,
                        backgroundColor: selectedTimescale === Timescale.Month ? `#111` : ``,
                    }}
                    onClick={() => {
                        setSelectedTimescale(_ => Timescale.Month)
                    }}
                >
                    {
                        getTimescaleText(Timescale.Month)
                    }
                </div>
                <div
                    className={styles.chartTimescaleOption}
                    style = {{
                        fontWeight: selectedTimescale === Timescale.Quarter ? `bold` : ``,
                        color: selectedTimescale === Timescale.Quarter ? `white` : `#999`,
                        backgroundColor: selectedTimescale === Timescale.Quarter ? `#111` : ``,
                    }}
                    onClick={() => {
                        setSelectedTimescale(_ => Timescale.Quarter)
                    }}
                >
                    {
                        getTimescaleText(Timescale.Quarter)
                    }
                </div>
                <div
                    className={styles.chartTimescaleOption}
                    style = {{
                        fontWeight: selectedTimescale === Timescale.Year ? `bold` : ``,
                        color: selectedTimescale === Timescale.Year ? `white` : `#999`,
                        backgroundColor: selectedTimescale === Timescale.Year ? `#111` : ``,
                    }}
                    onClick={() => {
                        setSelectedTimescale(_ => Timescale.Year)
                    }}
                >
                    {
                        getTimescaleText(Timescale.Year)
                    }
                </div>
            </div>
            <div className={styles.oroGoldTransparencyContainer}>
                <div className={styles.oroGoldTransparencyLogoContainer}>
                <Image
                    src="/images/Gold.svg"
                    alt="Logo"
                    width={72}
                    height={72}
                    style={{
                        height: "auto",
                        maxWidth: "200px",
                    }}
                    />
                </div>
                <div className={styles.oroGoldTransparencyNoteContainer}>
                    <div className={styles.oroGoldTransparencyNoteHeader}>
                        ORO is backed by real gold
                    </div>
                    <div className={styles.oroGoldTransparencyNoteContent}>
                        Your investments are backed 1:1 by ounces of real gold stored in a safe and secure location
                    </div>
                </div>
            </div>
            <div className={styles.oroGoldRewardPointsContainer}>
                <div className={styles.oroGoldRewardPointsInfoContainer}>
                    <div className={styles.oroGoldRewardPoints}>
                        0
                    </div>
                    <div className={styles.oroGoldRewardPointsTitle}>
                        Your Reward Points
                    </div>
                </div>
                <div className={styles.oroGoldRewardPointsButtonContainer}>
                    <span className={styles.pointsComingSoonContainer}>
                        COMING SOON
                    </span>
                </div>
            </div>
            <div className={styles.oroGoldPointsContainer}>

            </div>

        </div>
    )
}

export default OroInfoContainer;    