import React, { useEffect } from "react";
import {
  Box,
  Button,
  TextInput,
  NumberInput,
  Select,
  Modal,
  ModalProps,
} from "@mantine/core";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import { AuthGuard } from "~/features/common";
import { Order } from "~/server/models";
import { useForm } from "@mantine/form";

type EditOrderFormValues = Omit<
  Order,
  "user" | "items" | "status" | "price"
> & {
  price: number;
  status: string;
};

interface EditOrderModalProps extends Omit<ModalProps, "children"> {
  orderData: any;
  onClose: () => void;
}

export default function EditOrder({
  orderData,
  onClose,
  opened,
}: EditOrderModalProps) {
  const [pickUpDate, setPickUpDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const form = useForm<EditOrderFormValues>({});

  useEffect(() => {
    form.setValues({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData]);

  const handleSubmit = async (values: Order) => {};

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit ${orderData.name}`}
      centered
    >
      <form onSubmit={form.onSubmit((v) => {})}>
        <AuthGuard adminOnly>
          <Box className="bg-[#F6F5F8]">
            {/* Table */}
            <Box className="bg-white rounded-lg">
              <Box>
                <Box className="flex my-2">
                  <TextInput
                    className="mr-2"
                    label="Product Name"
                    radius="md"
                    size="md"
                    withAsterisk
                    value={orderData.name}
                  />
                  <Select
                    className="ml-2"
                    label="Payment Method"
                    placeholder={orderData.status}
                    withAsterisk
                    radius="md"
                    size="md"
                    data={[
                      { value: "Pending", label: "Pending" },
                      { value: "Processing", label: "Processing" },
                      { value: "Shipped", label: "Shipped" },
                      { value: "Delivered", label: "Delivered" },
                      { value: "Cancelled", label: "Cancelled" },
                      { value: "Refunded", label: "Refunded" },
                      { value: "Returned", label: "Returned" },
                    ]}
                  />
                </Box>

                <Box className="flex my-2">
                  <NumberInput
                    className="mr-2"
                    defaultValue={1}
                    label="Quantity"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                  <NumberInput
                    min={0}
                    precision={2}
                    className="ml-2"
                    label="Price"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                </Box>

                <Box className="flex my-2">
                  <DateInput
                    className="mr-2"
                    value={pickUpDate}
                    onChange={setPickUpDate}
                    label="Pickup Date"
                    placeholder="Date input"
                    radius="md"
                    size="md"
                    maw={400}
                    mx="auto"
                  />
                  <DateInput
                    className="ml-2"
                    value={returnDate}
                    onChange={setReturnDate}
                    label="Return Date"
                    placeholder="Date input"
                    radius="md"
                    size="md"
                    maw={400}
                    mx="auto"
                  />
                </Box>
                <TextInput
                  className="my-2"
                  label="Username"
                  radius="md"
                  size="md"
                  withAsterisk
                />
                <Select
                  className="my-2"
                  label="Payment Method"
                  withAsterisk
                  radius="md"
                  size="md"
                  data={[
                    { value: "Cash", label: "Cash on Delivery" },
                    { value: "Credit", label: "Credit Card" },
                    { value: "Visa", label: "Visa" },
                    { value: "FPS", label: "FPS" },
                  ]}
                />
                <TextInput
                  className="my-2"
                  label="Street Name"
                  radius="md"
                  size="md"
                  withAsterisk
                />
                <TextInput
                  className="my-2"
                  label="Building Name"
                  radius="md"
                  size="md"
                  withAsterisk
                />
                <Box className="flex my-2">
                  <TextInput
                    className="mr-2"
                    label="Block"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                  <TextInput
                    className="ml-2"
                    label="Floor"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                  <TextInput
                    className="ml-2"
                    label="Room"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                </Box>

                <Button
                  className="bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm my-2"
                  radius="md"
                >
                  Save Order
                </Button>
              </Box>
            </Box>
          </Box>
        </AuthGuard>
      </form>
    </Modal>
  );
}
