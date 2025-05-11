import { Box, Text, Stack } from "@mantine/core";
import ReactECharts from "echarts-for-react";

export default function DonutRatingChart({ skill }) {
  const scorePercent = (skill.score / 5) * 100;

  const option = {
    tooltip: { formatter: `{b}: {c}/5` },
    series: [
      {
        name: skill.title,
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: `${skill.score}/5`,
          fontSize: 18,
          fontWeight: "bold"
        },
        labelLine: { show: false },
        data: [
          {
            value: skill.score,
            name: skill.title,
            itemStyle: { color: "#228be6" }
          },
          {
            value: 5 - skill.score,
            name: "Remaining",
            itemStyle: { color: "#e0e0e0" }
          }
        ]
      }
    ]
  };

  return (
    <Box style={{ width: 200, height: 250 }}>
      <ReactECharts option={option} style={{ height: 200 }} />
      <Stack gap="xs" align="center" mt="sm">
        <Text fw={500}>{skill.courseTitle}</Text>
        <Text size="sm" c="dimmed">{skill.level}</Text>
      </Stack>
    </Box>
  );
}
