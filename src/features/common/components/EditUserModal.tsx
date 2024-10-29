import React, { useEffect } from "react";
import {
  Box,
  Button,
  TextInput,
  Modal,
  ModalProps,
  PasswordInput,
} from "@mantine/core";
import { AuthGuard } from "~/features/common";
import { User } from "~/server/models";
import { useForm } from "@mantine/form";
import { trpc } from "~/utils/trpc";

interface EditUserModalProps extends Omit<ModalProps, "children"> {
  userData: any;
  onClose: () => void;
}

export default function EditUser({
  userData,
  onClose,
  opened,
}: EditUserModalProps) {
  const trpcUtils = trpc.useContext();
  const { mutateAsync: update } = trpc.user.update.useMutation();
  const form = useForm<User>({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    },
    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    //   username: (value) => (value.length >= 3 ? null : "Username too short"),
    //   password: (value) => (value.length >= 8 ? null : "Password too short"),
    // },
  });

  useEffect(() => {
    form.setValues({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      password: userData.password,
    });
  }, [userData]);

  const handleSubmit = async (values: User) => {
    console.log(userData);
    await update({
      id: userData.id,
      updates: {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        password: values.password,
      },
    });
    await trpcUtils.user.getAllUser.invalidate();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit ${userData.username}`}
      centered
    >
      <form
        onSubmit={form.onSubmit((v) => {
          handleSubmit(v);
        })}
      >
        <AuthGuard adminOnly>
          <Box className="bg-[#F6F5F8]">
            {/* Table */}
            <Box className="bg-white rounded-lg">
              <Box>
                <TextInput
                  className="my-2"
                  placeholder=""
                  label="Email Address"
                  radius="md"
                  size="md"
                  withAsterisk
                  {...form.getInputProps("email")}
                />
                <Box className="flex my-2">
                  <TextInput
                    {...form.getInputProps("firstName")}
                    className="mr-2"
                    placeholder=""
                    label="First Name"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                  <TextInput
                    {...form.getInputProps("lastName")}
                    className="ml-2"
                    placeholder=""
                    label="Last Name"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                </Box>
                <TextInput
                  {...form.getInputProps("username")}
                  className="my-2"
                  placeholder=""
                  label="Username"
                  radius="md"
                  size="md"
                  withAsterisk
                />
                {/* <PasswordInput
                  {...form.getInputProps("password")}
                  className='my-2'
                  placeholder=""
                  label="Password"
                  radius="md"
                  size="md"
                  withAsterisk
                /> */}
                <Button
                  type="submit"
                  className="bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm my-2"
                  radius="md"
                >
                  Edit
                </Button>
              </Box>
            </Box>
          </Box>
        </AuthGuard>
      </form>
    </Modal>
  );
}
