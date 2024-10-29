import { Badge } from "@mantine/core";

export const StatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge
      variant="filled"
      color={
        status === "Pending"
          ? "blue"
          : status === "Processing"
          ? "yellow"
          : status === "Shipped"
          ? "blue"
          : status === "Delivered"
          ? "green"
          : status === "Cancelled"
          ? "red"
          : status === "Refunded"
          ? "red"
          : status === "Returned"
          ? "red"
          : "green"
      }
    >
      {status}
    </Badge>
  );
};
