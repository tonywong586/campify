import React, { useEffect } from "react";
import {
  Box,
  Button,
  Select,
  Modal,
  ModalProps,
  Table,
  Image,
  Text,
  Badge,
} from "@mantine/core";
import { Order, OrderDoc, Status } from "~/server/models";
import { useForm } from "@mantine/form";
import {
  booleanToYesNo,
  calcDays,
  formatDate,
  formatDateTime,
} from "~/utils/misc";
import { StatusBadge } from "./StatusBadge";
import Link from "next/link";
import { trpc } from "~/utils/trpc";

type EditOrderFormValues = Omit<
  Order,
  "user" | "items" | "status" | "price"
> & {
  price: number;
  status: string;
};

interface EditOrderModalProps extends Omit<ModalProps, "children"> {
  orderData?: OrderDoc;
  onClose: () => void;
  edit?: boolean;
}

export default function OrderHistoryModal({
  orderData,
  onClose,
  opened,
  edit,
}: EditOrderModalProps) {
  const form = useForm<{
    status: Status;
  }>({
    initialValues: {
      status: orderData?.status ?? "Pending",
    },
  });
  const trpcUtils = trpc.useContext();

  const updateStatus = trpc.order.updateStatus.useMutation();

  const [loading, setLoading] = React.useState(false);
  console.log(orderData);

  // useEffect(() => {
  //     form.setValues({});
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [orderData]);

  const rows = orderData?.items.map((item) => (
    <tr key={item._id.toString()}>
      <td>
        <Link href={`/product/${item.product?._id}`}>
          <Image
            placeholder
            src={item.product.images[0]}
            alt={item.product.name}
            width="100px"
            height="100px"
          />
        </Link>
      </td>
      <td>
        <Link href={`/product/${item.product?._id}`}>{item.product.name}</Link>
      </td>
      <td>{item.rental ? formatDate(item.rentDuration!.start) : "N/A"}</td>
      <td>
        {item.rental
          ? formatDate(item.rentDuration?.end!) +
            ` (${calcDays(
              item.rentDuration?.start!,
              item.rentDuration?.end!
            )} days)`
          : "N/A"}
      </td>
      <td>${item.product.price}</td>
      <td>{booleanToYesNo(item.rental)}</td>
    </tr>
  ));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Order ${orderData?._id}`}
      size="55%"
      centered
    >
      <Box>
        {/* Table */}
        <Box className="overflow-y-auto h-[30rem] mb-10">
          <Table
            striped
            highlightOnHover
            horizontalSpacing="sm"
            verticalSpacing="md"
          >
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                <th>Pick Up Date</th>
                <th>Return Date</th>
                <th>Price</th>
                <th>Rental</th>
              </tr>
            </thead>

            <tbody>{rows}</tbody>
          </Table>
        </Box>
        <Text className="text-[#9D9D9D] my-2">
          Create Date: {formatDateTime(orderData?.createdAt as unknown as Date)}
        </Text>
        <Text className="text-[#9D9D9D] my-2">
          Total Price ${orderData?.totalPrice} HKD
        </Text>

        <Text className="text-[#9D9D9D] my-2">
          Status: <StatusBadge status={orderData?.status ?? ""} />
        </Text>

        {edit && (
          <form
            onSubmit={form.onSubmit(async (v) => {
              setLoading(true);
              try {
                await updateStatus.mutateAsync({
                  id: orderData?._id!.toString() ?? "",
                  status: v.status,
                });

                await trpcUtils.order.listAll.refetch();

                onClose();
              } catch (e) {
                console.log(e);
              } finally {
                setLoading(false);
              }
            })}
          >
            <Select
              {...form.getInputProps("status")}
              className="my-2"
              label="Status"
              placeholder={orderData?.status}
              withAsterisk
              radius="md"
              size="md"
              data={[
                { value: "Pending", label: "Pending" },
                { value: "Processing", label: "Processing" },
                { value: "Shipped", label: "Shipped" },
                { value: "Delivered", label: "Delivered" },
                { value: "Cancelled", label: "Cancelled" },
                { value: "Paid", label: "Paid" },
              ]}
            />
            <Button
              loading={loading}
              type="submit"
              className="bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm my-2"
              radius="md"
            >
              Update
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  );
}
