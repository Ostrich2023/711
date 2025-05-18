import { Box, Text, Stack, Center } from "@mantine/core";
import ReactECharts from "echarts-for-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const PieChart = ({ data = [] }) => {
  const { t } = useTranslation();

  const chartData = data.map(item => ({
    name: typeof item.label === "object" ? JSON.stringify(item.label) : String(item.label),
    value: Number(item.value),
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const name = params.name.length > 16 ? params.name.slice(0, 16) + "…" : params.name;
        return `${name}: ${params.value}/5 (${params.percent}%)`;
      },
    },
    series: [
      {
        name: t("wallet.softSkillScores"),
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: (params) => {
            const name = params.name.length > 16 ? params.name.slice(0, 16) + "…" : params.name;
            return `${name}: ${params.value}`;
          },
          fontSize: 12,
        },
        labelLine: {
          show: true,
        },
        data: chartData,
      },
    ],
  };

  return (
    <Box style={{ width: "100%", height: 300 }}>
      {chartData.length > 0 ? (
        <ReactECharts option={option} style={{ height: "100%" }} />
      ) : (
        <Center h={300}>
          <Text color="dimmed">{t("chart.noSoftSkill") || "No soft skill score data available"}</Text>
        </Center>
      )}
      <Stack align="center" mt="sm">
        <Text fw={500}>{t("wallet.softSkillScores")}</Text>
      </Stack>
    </Box>
  );
};

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    })
  ).isRequired,
};

export default PieChart;
