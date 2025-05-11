import ReactECharts from "echarts-for-react";
import { Flex } from "@mantine/core";
import PropTypes from "prop-types";

const BarChart = ({ data }) => {
  const chartOptions = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" }
    },
    legend: {
      data: ["My Score", "Average Score"],
      top: 10
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: data.map(item => item.courseTitle),
      axisLabel: {
        interval: 0,
        rotate: 30,
        fontSize: 12
      }
    },
    yAxis: {
      type: "value",
      max: 5
    },
    series: [
      {
        name: "My Score",
        type: "bar",
        data: data.map(item => item.score),
        itemStyle: {
          color: "#4dabf7"
        },
        barWidth: "30%"
      },
      {
        name: "Average Score",
        type: "bar",
        data: data.map(item => item.avgScore),
        itemStyle: {
          color: "#f783ac"
        },
        barWidth: "30%"
      }
    ]
  };

  return (
    <Flex justify="center">
      <ReactECharts
        option={chartOptions}
        style={{ height: "350px", width: "100%" }}
      />
    </Flex>
  );
};

BarChart.propTypes = {
  data: PropTypes.array.isRequired
};

export default BarChart;