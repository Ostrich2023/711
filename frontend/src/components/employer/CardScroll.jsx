import { Paper, ScrollArea, Flex, Button, Card } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import classes from "../../pages/employer/EmployerPage.module.css";

export default function CardScroll({
  title,
  data,
  sortBy,
  renderItem,
  showAllLink = "/",
  showButton = true,
}) {
  const navigate = useNavigate();
  const sortedData = [...data].sort((a, b) =>
    new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime()
  );

  return (
    <Paper p="lg" radius="md" shadow="sm" withBorder>
      <Flex justify="space-between" align="center" mb="lg">
        <div className={classes.heading}>{title}</div>
        {showButton && (
          <Button
            onClick={() => navigate("students-list")}
            mr="sm"
            className={classes.actionButton}
          >
            Show all
          </Button>
        )}
      </Flex>
      <ScrollArea h={250} type="always" offsetScrollbars>
        {sortedData.map(item => (
          <Card
            key={item.id}
            withBorder
            radius="md"
            shadow="xs"
            mb="sm"
            p="md"
            component={Link}
            to={`/messages/${item.id}`}
            className={classes.messageCard}
          >
            {renderItem(item)}
          </Card>
        ))}
      </ScrollArea>
    </Paper>
  );
}
