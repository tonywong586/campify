import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Box, Text, Button, Table, Modal } from "@mantine/core";
import { Edit } from "tabler-icons-react";
import { Trash } from "tabler-icons-react";
import EditOrder from "../../features/common/components/EditOrderModal";
import { useState } from "react";
import { HeaderMegaMenu } from "~/features/template/components/Header";
import Link from "next/link";
import { AuthGuard } from "~/features/common";
import { AdminNavBar } from "~/features/common/components/AdminNavBar";
import { StatusBadge } from "~/features/common/components/StatusBadge";
import { trpc } from "~/utils/trpc";
import { formatDateTime } from "~/utils/misc";
import { OrderDoc } from "~/server/models";
import OrderHistoryModal from "~/features/common/components/OrderHistoryModal";

export default function Order() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: orders, isLoading: ordersLoading } =
    trpc.order.listAll.useQuery({});
  const [
    openedOrderHistory,
    { open: openOrderHistory, close: closeOrderHistory },
  ] = useDisclosure(false);
  const [orderData, setOrderData] = useState<OrderDoc>();
  // const rows = elements.map((element) => (
  //   <tr key={element.id}>
  //     <td>{element.id}</td>
  //     <td>{element.createdDate}</td>
  //     <td>{element.totalPrice}</td>
  //     <td>{element.payment}</td>
  //     <td>
  //       <StatusBadge status={element.status ?? ""} />
  //     </td>
  //     <td>
  //       <Button
  //         onClick={() =>
  //           setEditOrderData(
  //             element.id,
  //             element.createdDate,
  //             element.totalPrice,
  //             element.payment,
  //             element.status
  //           )
  //         }
  //         className="bg-transparent hover:bg-transparent"
  //       >
  //         <Edit size={30} strokeWidth={2} color={"#ffc700"} />
  //       </Button>
  //     </td>

  //     <td>
  //       <Button
  //         onClick={() => RemoveOrder(element.id)}
  //         className="bg-transparent hover:bg-transparent "
  //       >
  //         <Trash size={30} strokeWidth={2} color={"#bf4040"} />
  //       </Button>
  //     </td>
  //   </tr>
  // ));

  const rows = orders?.map((element) => (
    <tr
      role="button"
      className="cursor-pointer"
      key={element._id.toString()}
      onClick={() => {
        setOrderData(element);
        openOrderHistory();
      }}
    >
      <td>{element._id.toString()}</td>
      <td>{formatDateTime(element.createdAt as unknown as Date)}</td>
      <td>${element.totalPrice} HKD</td>
      <td>{element.paymentType}</td>
      <td>
        <StatusBadge status={element.status ?? ""} />
      </td>
    </tr>
  ));

  return (
    <AuthGuard adminOnly>
      <Box className="bg-[#F6F5F8] min-h-screen h-screen">
        <HeaderMegaMenu />
        <Box className="flex flex-col p-5 lg:p-10">
          {/* top banner */}
          <AdminNavBar />
          {/* title and button */}
          <Box className="flex items-center justify-between my-10">
            <Text className="py-4 text-2xl font-bold">Orders</Text>
          </Box>
          {/* Table */}
          <Box className="p-10 bg-white rounded-lg overflow-y-auto h-[30rem]">
            <Table
              striped
              highlightOnHover
              horizontalSpacing="sm"
              verticalSpacing="md"
            >
              <thead>
                <tr>
                  <th>
                    <span>ID</span>
                  </th>
                  <th>Created Date</th>
                  <th>Total Price</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>{rows}</tbody>
            </Table>
          </Box>
        </Box>
      </Box>
      <OrderHistoryModal
        orderData={orderData}
        opened={openedOrderHistory}
        onClose={closeOrderHistory}
        edit
      />
    </AuthGuard>
  );
}
