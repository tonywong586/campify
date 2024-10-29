import React from "react";
import {
  Box,
  Button,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  FileInput,
  Modal,
  ModalProps,
} from "@mantine/core";
import { Product } from "~/server/models";
import { AuthGuard } from "~/features/common";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useS3Upload } from "next-s3-upload";

type EditProductFormValues = Omit<Product, "reviews" | "images" | "_id"> & {
  images: File[];
};

interface EditProductModalProps extends Omit<ModalProps, "children"> {
  productData: any;
  onClose: () => void;
}

export default function EditProduct({
  productData,
  opened,
  onClose,
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<Omit<EditProductFormValues, "rating">>({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      quantity: 1,
      category: "",
      images: [],
      rental: false,
    },
  });

  const handleSubmit = async (v: EditProductFormValues) => {};

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit ${productData.name}`}
      centered
    >
      <form
        onSubmit={form.onSubmit((v) => {
          //@ts-ignore
          handleSubmit(v);
        })}
      >
        <AuthGuard adminOnly>
          <Box className="bg-[#F6F5F8]">
            {/* Table */}
            <Box className="bg-white rounded-lg">
              <Box>
                <Box className="flex my-2">
                  <TextInput
                    {...form.getInputProps("name")}
                    className="mr-2"
                    placeholder={productData.name}
                    label="Name"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                  <TextInput
                    {...form.getInputProps("price")}
                    className="ml-2"
                    placeholder={`$${productData.price}`}
                    label="Price"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                </Box>

                <Select
                  {...form.getInputProps("category")}
                  className="my-2"
                  label="Category"
                  placeholder={productData.category}
                  withAsterisk
                  radius="md"
                  size="md"
                  data={[
                    { value: "react", label: "React" },
                    { value: "ng", label: "Angular" },
                    { value: "svelte", label: "Svelte" },
                    { value: "vue", label: "Vue" },
                  ]}
                />

                <NumberInput
                  {...form.getInputProps("quantity")}
                  className="my-2"
                  defaultValue={1}
                  label="Quantity"
                  radius="md"
                  size="md"
                  withAsterisk
                  value={productData.quantity}
                />
                <FileInput
                  {...form.getInputProps("images")}
                  className="my-2"
                  label="Product Images"
                  radius="md"
                  size="md"
                  placeholder="Upload files"
                  multiple
                />
                <Textarea
                  {...form.getInputProps("description")}
                  className="my-2"
                  placeholder={productData.description}
                  label="Description"
                  radius="md"
                  size="md"
                  withAsterisk
                />
                <Button
                  type="submit"
                  loading={loading}
                  className="bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm my-2"
                  radius="md"
                >
                  Save Product
                </Button>
              </Box>
            </Box>
          </Box>
        </AuthGuard>
      </form>
    </Modal>
  );
}
