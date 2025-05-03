import React from "react";
import Chart from "react-apexcharts";

const BarChart = ({ data = [], categories = [], title = "Barchart" }) => {
  const defaultData = [141, 110, 170, 70, 120, 31, 89, 130, 70, 110, 159, 41];
  const defaultCategories = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const chartCategories =
    categories.length > 0 ? categories : defaultCategories;

  const options = {
    chart: {
      fontFamily: "'Satoshi', sans-serif",
      toolbar: {
        show: false,
      },
    },
    colors: ["#475569"],
    plotOptions: {
      bar: {
        borderRadius: 3,
        borderRadiusApplication: "end",
        columnWidth: "24px",
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      borderColor: "#E2E8F0",
      strokeDashArray: 5,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: chartCategories,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#475569",
          fontSize: "14px",
          fontWeight: 500,
          fontFamily: "'Satoshi', sans-serif",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 400,
      tickAmount: 4,
      labels: {
        style: {
          colors: "#475569",
          fontSize: "12px",
          fontWeight: 500,
          fontFamily: "'Satoshi', sans-serif",
        },
        formatter: (value) => value,
      },
    },
    tooltip: {
      enabled: true,
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          xaxis: {
            labels: {
              fontSize: "12px",
            },
          },
          yaxis: {
            labels: {
              fontSize: "10px",
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Value",
      data: chartData,
    },
  ];

  return (
    <div className="w-full  p-8 rounded-2xl border border-slate-200 bg-white">
      <h2 className="font-bold text-2xl text-slate-900 mb-5 font-satoshi">
        {title}
      </h2>
      <div className="w-full h-[248px] relative">
        <Chart options={options} series={series} type="bar" height="100%" />
      </div>
    </div>
  );
};

export default BarChart;

/*
Example Usage:
<BarChart
  data={[10, 20, 30, 40, 50]}
  categories={["Jan", "Feb", "Mar", "Apr", "May"]}
/>
*/
