import ReactECharts from "echarts-for-react";
import { Flex, Text } from "@mantine/core";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const BarChart = ({ data = [] }) => {
  const { t } = useTranslation();

  const cleanedData = data.map((item) => ({
    label: typeof item.label === "object" ? JSON.stringify(item.label) : String(item.label),
    value: typeof item.value === "number" ? item.value : 0,
  }));

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: cleanedData.map((item) =>
        item.label.length > 16 ? item.label.slice(0, 16) + "…" : item.label
      ),
      axisLabel: {
        interval: 0,
        rotate: cleanedData.length > 4 ? 30 : 0,
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      max: 5,
    },
    series: [
      {
        name: t("wallet.hardSkillScores"),
        type: "bar",
        data: cleanedData.map((item) => item.value),
        itemStyle: {
          color: "#4dabf7",
        },
        barWidth: "40%",
      },
    ],
  };

  return (
    <Flex justify="center">
      {cleanedData.length > 0 ? (
        <ReactECharts
          option={option}
          style={{ height: "350px", width: "100%" }}
        />
      ) : (
        <Text color="dimmed" mt="md">
          {t("chart.noHardSkill") || "No hard skill score data available"}
        </Text>
      )}
    </Flex>
  );
};

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    })
  ).isRequired,
};

export default BarChart;
