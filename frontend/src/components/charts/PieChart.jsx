import React from "react";
import Chart from "react-apexcharts";

const PieChart = ({ data = [], labels = [], total = null }) => {
  // Default data if none provided
  const defaultData = [7125, 4720, 3952];
  const defaultLabels = ["Beverage", "Food", "Snack"];
  const defaultTotal = 15770;

  const chartData = data.length > 0 ? data : defaultData;
  const chartLabels = labels.length > 0 ? labels : defaultLabels;
  const chartTotal = total || defaultTotal;

  // Calculate percentages
  const percentages = chartData.map((value) =>
    Math.round((value / chartTotal) * 100)
  );

  // Format labels with percentages and values
  const formattedLabels = chartLabels.map(
    (label, index) =>
      `${label} ${percentages[index]}% (${chartData[index].toLocaleString()})`
  );

  const options = {
    chart: {
      fontFamily: "'Satoshi', sans-serif",
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    colors: ["#475569", "#64748B", "#94A3B8"],
    labels: chartLabels,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "18px",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 900,
              color: "#212B36",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "14px",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 900,
              color: "#212B36",
              offsetY: 5,
              formatter: function () {
                return chartTotal.toLocaleString();
              },
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "18px",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 900,
              color: "#212B36",
              formatter: function () {
                return chartTotal.toLocaleString();
              },
            },
          },
        },
      },
    },
    stroke: {
      width: 0,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (value) {
          return value.toLocaleString();
        },
      },
    },
  };

  const series = chartData;

  return (
    <div className="w-[520px] h-[318px] p-6 rounded-2xl border border-slate-200 bg-white">
      <h2 className="font-bold text-2xl text-slate-900 mb-5 font-satoshi">
        Pie chart
      </h2>
      <div className="flex">
        <div className="w-1/2 h-[200px] flex items-center justify-center">
          <Chart
            options={options}
            series={series}
            type="donut"
            height="100%"
            width="100%"
          />
        </div>

        {/* Custom legend */}
        <div className="w-1/2 flex flex-col justify-center space-y-7">
          {chartLabels.map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-[17px] h-[17px] rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: options.colors[index] }}
              ></div>
              <div className="flex justify-between flex-1">
                <span className="text-[#212B36] text-sm font-medium">
                  {label}
                </span>
                <span className="text-[#212B36] text-sm font-medium ml-2">
                  {percentages[index]}% ({chartData[index].toLocaleString()})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;

/* 
Example Usage:
<PieChart
  data={[7125, 4720, 3952]}
  labels={["Beverage", "Food", "Snack"]}
  total={15770}
/>
*/
