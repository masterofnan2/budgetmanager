import React from 'react';
import Chart from 'react-google-charts';
import backend from '../../../api/functions/backend';
import NoLineChart from './NoLineChart';
import LoadingPage from '../../../core/elements/LoadingPage';
import { SpinnerDisplayer } from '../../../core/elements/minitatures';

const LineChart = React.memo(({ currentCycle }) => {
    const [component, setComponent] = React.useState({
        chartData: null,
        chartOptions: []
    });

    React.useEffect(() => {
        currentCycle?.renewal_frequency &&
            delete currentCycle.renewal_frequency;

        backend('/chart/expense', { cycle: currentCycle || null }, "POST")
            .then(response => {
                if (response.data) {
                    const { chartData, chartOptions } = response.data;

                    setComponent(C => {
                        return { ...C, chartData, chartOptions };
                    });
                }
            })
    }, [currentCycle]);

    return <div className='p-3' style={{ backgroundColor: "#e7e7e7" }}>
        {!component.chartData && <SpinnerDisplayer />}
        {component.chartData?.length < 3 && <NoLineChart />}
        {component.chartData?.length >= 3 &&
            <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                loader={<LoadingPage />}
                data={component.chartData}
                options={component.chartOptions}
            />
        }
    </div>
});

export default LineChart;