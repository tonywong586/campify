import { HeaderMegaMenu } from "~/features/template/components/Header";
import {
  Container,
  Stack,
  Button,
  Box,
  Table,
  Image,
  UnstyledButton,
  LoadingOverlay,
} from "@mantine/core";
import { Avatar } from "@mantine/core";
import { UserCircle, Mail } from "tabler-icons-react";
import { AuthGuard } from "~/features/common";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import EditPersonalInformationModal from "~/features/common/components/EditPersonalInformationModal";
import { useRouter } from "next/router";
import Link from "next/link";
import OrderHistoryModal from "~/features/common/components/OrderHistoryModal";
import { trpc } from "~/utils/trpc";
import { formatDateTime } from "~/utils/misc";
import { OrderDoc } from "~/server/models";
import { StatusBadge } from "~/features/common/components/StatusBadge";

export default function Profile() {
  const router = useRouter();
  const { pathname } = useRouter();

  console.log(pathname);
  const { data: session } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedOrderHistory,
    { open: openOrderHistory, close: closeOrderHistory },
  ] = useDisclosure(false);
  const [orderData, setOrderData] = useState<OrderDoc>();
  const userData = {
    username: session?.user.username,
    first: session?.user.firstName,
    last: session?.user.lastName,
    email: session?.user.email,
  };

  const { data: orders, isLoading: ordersLoading } = trpc.order.list.useQuery(
    {}
  );

  const handleSignOut = async () => {
    await signOut();
  };

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
    <AuthGuard>
      <Stack className=" w-full bg-[#F6F5F8] overflow-x-hidden">
        <HeaderMegaMenu />
        <Container className="flex w-full max-w-[1200px] min-h-screen flex-col">
          <div className="flex flex-col items-center w-full h-full p-8 md:items-start">
            <div className="flex flex-row items-center justify-between w-full">
              <h2>Profile</h2>
              <Button onClick={handleSignOut} className="duration-200">
                Sign out
              </Button>
            </div>
            <hr className="w-full bg-[#D3D3D3] rounded-xl" />
            <div className="flex flex-col items-center w-full mt-8 lg:items-start lg:flex-row lg:justify-center">
              <div className="flex flex-col items-center w-2/4 lg:items-start">
                <div className="flex flex-col items-center justify-start">
                  <Avatar
                    className="rounded-full"
                    w={120}
                    h={120}
                    size={120}
                    variant="filled"
                    color="yellow"
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${session?.user.username}`}
                  ></Avatar>
                  <div className="flex flex-col items-center pt-2">
                    <div className="flex text-2xl font-bold">
                      {`${session?.user.firstName} ${session?.user.lastName}`}
                    </div>
                    <div className="flex font-medium text-[#969696] text-lg">
                      {session?.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-start py-10 text-center lg:items-start">
                  <Link
                    href="/profile?type=personal"
                    className={`${router.query.type === "personal"
                        ? "translate-x-4 text-[#315E52]"
                        : "translate-x-0"
                      } hover:text-[#315E52] hover:translate-x-4 duration-150 transition-all my-3 font-bold hover:font-bold text-xl lg:text-2xl text-center `}
                  >
                    Personal Information
                  </Link>
                  <Link
                    href="/profile?type=order"
                    className={`${router.query.type === "order"
                        ? "translate-x-4 text-[#315E52]"
                        : "translate-x-0"
                      } hover:text-[#315E52] hover:translate-x-4 duration-150 transition-all my-3 font-bold hover:font-bold text-xl lg:text-2xl text-center `}
                  >
                    Order History
                  </Link>
                </div>
              </div>
              {/* Personal Infromation */}
              {router.query.type === "personal" ? (
                <div className="flex flex-col w-full pb-20 mb-auto">
                  <div className="flex self-center text-2xl font-bold text-center lg:self-start">
                    Personal Information
                  </div>
                  <div className="flex font-medium text-[#969696] text-md text-center self-center lg:self-start">
                    Manage your information, including first last name,
                    username, and email address.
                  </div>
                  <UnstyledButton
                    onClick={open}
                    className="font-medium text-[#969696] underline hover:text-black mt-8 mb-2 ml-auto"
                  >
                    Edit
                  </UnstyledButton>
                  <div className="flex flex-col rounded-lg lg:flex-row lg:space-x-8">
                    <Box className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
                      <div className="flex flex-col justify-center w-full h-full px-6 py-8 bg-white rounded-lg shadow-md">
                        <div className="flex flex-row justify-between w-full">
                          <span className="text-xl font-bold ">First Name</span>
                          <UserCircle
                            size={30}
                            strokeWidth={2}
                            color={"black"}
                          />
                        </div>
                        <span className=" text-md font-normal text-[#969696]">
                          {session?.user.firstName}
                        </span>
                      </div>

                      <div className="flex flex-col justify-center w-full h-full px-6 py-8 bg-white rounded-lg shadow-md">
                        <div className="flex flex-row justify-between w-full">
                          <span className="text-xl font-bold ">Last Name</span>
                          <UserCircle
                            size={30}
                            strokeWidth={2}
                            color={"black"}
                          />
                        </div>
                        <span className=" text-md font-normal text-[#969696]">
                          {session?.user.lastName}
                        </span>
                      </div>

                      <div className="flex flex-col justify-center w-full h-full px-6 py-8 bg-white rounded-lg shadow-md">
                        <div className="flex flex-row justify-between w-full">
                          <span className="text-xl font-bold ">Username</span>
                          <UserCircle
                            size={30}
                            strokeWidth={2}
                            color={"black"}
                          />
                        </div>
                        <span className=" text-md font-normal text-[#969696]">
                          {session?.user.username}
                        </span>
                      </div>

                      <div className="flex flex-col justify-center w-full h-full px-6 py-8 bg-white rounded-lg shadow-md">
                        <div className="flex flex-row justify-between w-full">
                          <span className="text-xl font-bold ">
                            Email Address
                          </span>
                          <Mail size={30} strokeWidth={2} color={"black"} />
                        </div>
                        <span className=" text-md font-normal text-[#969696]">
                          {session?.user.email}
                        </span>
                      </div>
                    </Box>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col w-full pb-20 mb-auto">
                  <LoadingOverlay visible={ordersLoading} />
                  <div className="flex self-center text-2xl font-bold text-center lg:self-start">
                    Order History
                  </div>
                  <div className="flex font-medium text-[#969696] text-md text-center self-center lg:self-start">
                    See your order history here
                  </div>
                  <div className="mt-10 overflow-y-auto h-[28rem]">
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
                  </div>
                </div>
              )}
            </div>
          </div>
          <EditPersonalInformationModal
            userData={userData}
            opened={opened}
            onClose={close}
          />
          <OrderHistoryModal
            orderData={orderData}
            opened={openedOrderHistory}
            onClose={closeOrderHistory}
          />
        </Container>
      </Stack>
    </AuthGuard>
  );
}
