'use client';
import { useEffect, useState, useRef, MouseEvent } from 'react';
import ChartJS from 'chart.js/auto';

interface PieChartData {
    labels:string[];
    data: number[];
    backgroundColor: string[];
}

const Chart: React.FC<{
    data: any[];
}> = ({ data }) => {

    const chartRef = useRef<ChartJS<'pie', number[], string> | null>(null);
    const [chartData, setChartData] = useState<PieChartData | null>(null);
    const chartCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const colors: string[] = [
            '#bce2d5',
            '#fbd4db',
            '#d3e6f4',
            '#b9b9d5',
            '#fcd1be',
        ];
        setChartData({
            labels:["Similar", "Dissimilar"],
            data: data,
            backgroundColor: colors
        });
    }, [data]);

    useEffect(() => {
        if (chartRef.current) {
            // If chart already exists, destroy it first
            chartRef.current.destroy();
        }
        // Render chart using Chart.js
        if (chartData) {
            const ctx = document.getElementById('myChart') as HTMLCanvasElement;
            if (ctx) {
                const newChart = new ChartJS(ctx, {
                    type: 'pie',
                    data: {
                        labels: chartData.labels,
                        datasets: [
                            {
                                data: chartData.data,
                                backgroundColor: chartData.backgroundColor,
                            },
                        ],
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                    },
                });
                chartRef.current = newChart;
            }
        }
    }, [chartData]);

    return (
        <div className="w-full" style={{margin:"0%"}}>
            <canvas id="myChart" ref={chartCanvasRef}></canvas>
        </div>
    );
};

export default Chart;