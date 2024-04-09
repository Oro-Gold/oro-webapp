import React from "react";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { ApexOptions } from "apexcharts";
import styles from "./OroChartContainer.module.css";
import dynamic from "next/dynamic";
import { Timescale } from "@/constants";

export interface OroChartProps {
    series: [],
}

const OroChart = ({
    series,
}: OroChartProps) => {
        
    const state = {
        options: {
          xaxis: {
            labels: {
                show: false,
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
          },
          legend: {
            show: false
          },
          grid: {
            show: false
          },
          tooltip: {
            enabled: false
          },
          dataLabels: {
            enabled: false
          },
          chart: {
            toolbar: {
                show: false
            }
          },
          yaxis: {
            show: false
          },
          stroke: {
            colors: [
                `#ffce71`
            ],
            curve: 'smooth'
            // fill: {
            //     colors: [
            //         `#ffce71`
            //     ],
            //     gradient: {
            //         opacityFrom: 1.0,
            //         opacityTo: 0.0
            //     }
            // }
          }
        } as ApexOptions,
        series: [
            {
                name: 'series-1',
                data: series && series.length > 0 ? series : []
            },
            // {
            // name: 'series-2',
            // data: [23, 12, 54, 61, 32, 56, 81, 19]
            // }
        ],
    };
  

    return (
        <div>
          <div id="chart" className={styles.chartContainer}>
            <Chart options={state.options} series={state.series} type="line" height={"350"} />
          </div>
          <div id="html-dist"></div>
        </div>
      );

}

export default OroChart;