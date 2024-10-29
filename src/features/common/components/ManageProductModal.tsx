import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextInput,
  Textarea,
  NumberInput,
  FileInput,
  Modal,
  ModalProps,
  Switch,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Product, ProductDoc } from "~/server/models";
import { trpc } from "~/utils/trpc";
import { CategoryPicker } from "~/features/common";
import { useS3Upload } from "next-s3-upload";

type ProductFormValues = Omit<Product, "reviews" | "images"> & {
  imagesFile: File[];
};

interface ManageProductModalProps extends Omit<ModalProps, "children"> {
  onClose: () => void;
  editMode?: boolean;
  product?: ProductDoc;
}

export function ManageProductModal({
  onClose,
  opened,
  editMode = false,
  product,
}: ManageProductModalProps) {
  const trpcUtils = trpc.useContext();
  let { uploadToS3 } = useS3Upload();
  const form = useForm<Omit<ProductFormValues, "rating">>({
    initialValues: {
      _id: product?._id.toString() || "",
      name: product?.name || "",
      price: product?.price || 0,
      description: product?.description || "",
      quantity: product?.quantity || 1,
      category: product?.category || "",
      imagesFile: [],
      rental: product?.rental || false,
    },
  });

  const [loading, setLoading] = useState(false);

  const createProduct = trpc.product.create.useMutation();

  const updateProduct = trpc.product.update.useMutation();

  useEffect(() => {
    // if (editMode && product) {
    //   //transform the images to file
    //   const images = product.images.map((image) => {
    //     const byteString = atob(image.split(",")[1]);
    //     const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
    //     const ab = new ArrayBuffer(byteString.length);
    //     const ia = new Uint8Array(ab);
    //     for (let i = 0; i < byteString.length; i++) {
    //       ia[i] = byteString.charCodeAt(i);
    //     }
    //     const blob = new Blob([ab], { type: mimeString });
    //     const file = new File([blob], "image.png", { type: mimeString });
    //     return file;
    //   });

    console.log("editPRoduct", product);
    if (product) {
      form.setValues({
        name: product.name,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
        category: product.category,
        imagesFile: [],
        rental: product.rental,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, product]);

  useEffect(() => {
    if (!editMode) {
      form.reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  const handleSubmit = async (v: ProductFormValues) => {
    setLoading(true);

    const images = await Promise.all(
      v.imagesFile.map(async (file) => {
        const { url } = await uploadToS3(file);
        return url;
      })
    );
    console.log(images);
    // const { url } = await uploadToS3(v.images[0]);
    // console.log(url);
    //make the images to base64
    // const images = await Promise.all(
    //   v.images.map(async (file) => {
    //     console.log(file);
    //     const base64 = await new Promise<string>((resolve, reject) => {
    //       const reader = new FileReader();
    //       reader.readAsDataURL(file);
    //       reader.onload = () => resolve(reader.result as string);
    //       reader.onerror = (error) => reject(error);
    //     });
    //     return base64;
    //   })
    // );

    try {
      if (editMode && product) {
        let updatedImages = product.images;
        if (images.length > 0) {
          updatedImages = images;
        }
        await updateProduct.mutateAsync({
          id: product._id.toString(),
          updates: {
            name: v.name,
            price: v.price,
            description: v.description,
            quantity: v.quantity,
            category: v.category,
            rental: v.rental,
            images: updatedImages,
          },
        });
      } else {
        await createProduct.mutateAsync({
          name: v.name,
          price: v.price,
          description: v.description,
          quantity: v.quantity,
          category: v.category,
          rental: v.rental,
          images,
        });
      }

      await trpcUtils.product.list.invalidate();

      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editMode ? "Edit Product" : "Add Product"}
      centered
    >
      <form
        onSubmit={form.onSubmit((v) => {
          //@ts-ignore
          handleSubmit(v);
        })}
      >
        <Box className="bg-[#F6F5F8]">
          {/* Table */}
          <Box className="bg-white rounded-lg">
            <Box>
              <Box className="flex my-2">
                <TextInput
                  {...form.getInputProps("name")}
                  className="mr-2"
                  label="Name"
                  radius="md"
                  size="md"
                  withAsterisk
                  required
                />

                <NumberInput
                  {...form.getInputProps("price")}
                  min={0}
                  precision={2}
                  className="ml-2"
                  label="Price"
                  radius="md"
                  size="md"
                  withAsterisk
                />
              </Box>

              <CategoryPicker {...form.getInputProps("category")} />

              <NumberInput
                {...form.getInputProps("quantity")}
                className="my-2"
                defaultValue={1}
                min={1}
                placeholder=""
                label="Quantity"
                radius="md"
                size="md"
                withAsterisk
              />

              <Switch
                {...form.getInputProps("rental")}
                checked={form.values.rental}
                my="sm"
                size="md"
                label="Rental"
              />

              <FileInput
                {...form.getInputProps("imagesFile")}
                accept="image/png, image/jpeg"
                required
                className="my-2"
                label="Product Images"
                radius="md"
                size="md"
                placeholder="Upload files"
                multiple
              />

              <Textarea
                {...form.getInputProps("description")}
                required
                className="my-2"
                placeholder=""
                label="Description"
                radius="md"
                size="md"
              />

              <Button type="submit" loading={loading} radius="md">
                {editMode ? "Update Product" : "Add Product"}
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
    </Modal>
  );
}
