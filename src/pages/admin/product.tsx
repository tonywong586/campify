import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Box, Text, Button, Table, LoadingOverlay, Image } from "@mantine/core";
import { Edit, ExternalLink, Trash } from "tabler-icons-react";
import { useState } from "react";
import { HeaderMegaMenu } from "~/features/template/components/Header";
import { AuthGuard } from "~/features/common";
import { trpc } from "~/utils/trpc";
import { showNotification } from "@mantine/notifications";
import { categoryToString } from "~/utils/category";
import Link from "next/link";
import { ManageProductModal } from "~/features/common";
import { ProductDoc } from "~/server/models";
import { AdminNavBar } from "~/features/common/components/AdminNavBar";
import { booleanToYesNo } from "~/utils/misc";

export default function ProductManage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    data: products,
    refetch: refetchProducts,
    isFetching: isFetchingProducts,
  } = trpc.product.list.useQuery({
    column: "createdAt",
    sort: -1,
    category: "",
  });

  const deleteProduct = trpc.product.delete.useMutation();

  // product data
  const [productData, setProductData] = useState<ProductDoc>();

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);

    try {
      await deleteProduct.mutateAsync({
        id,
      });

      await refetchProducts();

      showNotification({
        title: "Product Deleted",
        message: "Product has been deleted successfully",
        color: "red",
      });

      setLoading(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  console.log(products);
  const rows = products?.map((item) => (
    <tr key={item.name}>
      <td>{item._id.toString()}</td>
      <td>
        <Image src={item.images[0]} alt="image" width={50} height={50} />
      </td>
      <td>
        <div className=" line-clamp-2">{item.name}</div>
      </td>
      <td>
        <div className=" line-clamp-2">{item.description}</div>
      </td>
      <td>${item.price}</td>
      <td>{item.quantity}</td>
      <td>{item.rating}</td>
      <td>{categoryToString(item.category)}</td>
      <td>{booleanToYesNo(item.rental)}</td>
      <td>
        <Link
          href={`/product/${item._id.toString()}`}
          className="p-0 bg-transparent hover:bg-transparent"
        >
          <ExternalLink size={30} strokeWidth={2} color={"#315E52"} />
        </Link>
      </td>
      <td>
        <Button
          onClick={async () => {
            console.log("edit", item);
            setProductData(item);
            setEditMode(true);
            open();
          }}
          className="p-0 bg-transparent hover:bg-transparent"
        >
          <Edit size={30} strokeWidth={2} color={"#ffc700"} />
        </Button>
      </td>
      <td>
        <Button
          onClick={() => {
            handleDeleteProduct(item._id.toString());
          }}
          className="p-0 pl-3 bg-transparent hover:bg-transparent"
        >
          <Trash size={30} strokeWidth={2} color={"#bf4040"} />
        </Button>
      </td>
    </tr>
  ));

  return (
    <AuthGuard adminOnly>
      <LoadingOverlay visible={loading} />
      <Box className="bg-[#F6F5F8] min-h-screen">
        <HeaderMegaMenu />
        <Box className="flex flex-col p-5 lg:p-10">
          <AdminNavBar />

          {/* title and button */}
          <Box className="flex items-center justify-between my-10">
            <Text className="py-4 text-2xl font-bold">Product List</Text>
            <Button
              onClick={() => {
                setEditMode(false);
                setProductData(undefined);
                open();
              }}
              className="bg-[#315E52] hover:bg-[#387D6B] text-white font-bold w-[150px] h-[40px] duration-150 text-sm rounded-md flex items-center justify-center"
            >
              Add Product
            </Button>
          </Box>

          {/* Table */}
          <Box className="p-10 bg-white rounded-lg overflow-y-scroll h-[30rem]">
            <Table
              striped
              highlightOnHover
              horizontalSpacing="sm"
              verticalSpacing="md"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Rating</th>
                  <th>Category</th>
                  <th>Rental</th>
                  <th>External Link</th>
                  <th>Edit</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody>{rows}</tbody>
            </Table>
          </Box>

          {/* Modal */}
          <ManageProductModal
            product={productData}
            editMode={editMode}
            opened={opened}
            onClose={close}
          />
        </Box>
      </Box>
    </AuthGuard>
  );
}
