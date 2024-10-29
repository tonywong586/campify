import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Box, Text, Button, Table, Modal } from "@mantine/core";
import { Edit, Plus } from "tabler-icons-react";
import { Trash } from "tabler-icons-react";
import AddUser from "../../features/common/components/AddUserModal";
import EditUser from "../../features/common/components/EditUserModal";
import { useState } from "react";
import { HeaderMegaMenu } from "~/features/template/components/Header";
import Link from "next/link";
import { AuthGuard } from "~/features/common";
import { trpc } from "~/utils/trpc";
import { AdminNavBar } from "~/features/common/components/AdminNavBar";

export default function UserManage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [opened2, { open: open2, close: close2 }] = useDisclosure(false);
  const { mutateAsync: deleteUser } = trpc.user.delete.useMutation();
  const trpcUtils = trpc.useContext();

  // user data
  const [userData, setUserData] = useState({
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const RemoveUser = async (id: any) => {
    await deleteUser({ id: id });
    await trpcUtils.user.getAllUser.invalidate();
    console.log("User deleted");
  };

  const {
    data: users,
    refetch: refetchUsers,
    isFetching: isFetchingUsers,
  } = trpc.user.getAllUser.useQuery();

  const elements = [
    { id: users, email: "tonywong555@gmail.com", name: "Tony" },
    { id: 7, email: "tonywong555@gmail.com", name: "Elvis" },
    { id: 39, email: "tonywong555@gmail.com", name: "Elvin" },
    { id: 56, email: "tonywong555@gmail.com", name: "TszHo" },
    { id: 6, email: "tonywong555@gmail.com", name: "Tony" },
    { id: 7, email: "tonywong555@gmail.com", name: "Elvis" },
    { id: 39, email: "tonywong555@gmail.com", name: "Elvin" },
    { id: 56, email: "tonywong555@gmail.com", name: "TszHo" },
    { id: 6, email: "tonywong555@gmail.com", name: "Tony" },
    { id: 7, email: "tonywong555@gmail.com", name: "Elvis" },
    { id: 39, email: "tonywong555@gmail.com", name: "Elvin" },
    { id: 56, email: "tonywong555@gmail.com", name: "TszHo" },
  ];

  const setEditUser = (
    id: any,
    email: any,
    firstName: any,
    lastName: any,
    username: any,
    password: any
  ) => {
    setUserData({
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
    });

    open2();
  };

  const rows = users?.map((element) => (
    <tr key={element._id.toString()}>
      <td>{element._id.toString()}</td>
      <td>
        <div className="whitespace-nowrap max-w-[50px] overflow-hidden overflow-ellipsis">
          {element.email}
        </div>

      </td>
      <td
      >
        <div className="max-w-[50px] overflow-hidden overflow-ellipsis">
          {element.firstName}
        </div>
      </td>
      <td
      >
        <div className="max-w-[50px] overflow-hidden overflow-ellipsis">
          {element.lastName}
        </div>
      </td>
      <td>
        <div className="max-w-[50px] overflow-hidden overflow-ellipsis">
          {element.username}
        </div>
      </td>
      <td>
        <Button
          onClick={() =>
            setEditUser(
              element._id,
              element.email,
              element.firstName,
              element.lastName,
              element.username,
              element.password
            )
          }
          className="bg-transparent px-0 hover:bg-transparent"
        >
          <Edit size={30} strokeWidth={2} color={"#ffc700"} />
        </Button>
      </td>
      <td>
        <Button
          onClick={() => RemoveUser(element._id)}
          className="bg-transparent  px-0 hover:bg-transparent  pl-3"
        >
          <Trash size={30} strokeWidth={2} color={"#bf4040"} />
        </Button>
      </td>
    </tr>
  ));

  return (
    <AuthGuard adminOnly>
      <Box className="bg-[#F6F5F8] min-h-screen">
        <HeaderMegaMenu />
        <Box className="flex flex-col p-5 lg:p-10">
          {/* top banner */}
          <AdminNavBar />

          {/* title and button */}
          <Box className="flex items-center justify-between my-10">
            <Text className="py-4 text-2xl font-bold">User List</Text>
            <Button
              onClick={open}
              className="bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm"
              radius="md"
              rightIcon={
                <Plus
                  size={20}
                  strokeWidth={2}
                  color={'white'}
                />
              }
            >
              Add User
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
                  <th>
                    <span>ID</span>
                  </th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                  <th>Edit</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Box>

          {/* Modal */}
          <AddUser opened={opened} onClose={close} />
          <EditUser userData={userData} opened={opened2} onClose={close2} />
        </Box>
      </Box>
    </AuthGuard>
  );
}
