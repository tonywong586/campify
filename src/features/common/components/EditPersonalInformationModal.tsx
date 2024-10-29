import React from "react";
import { Box, Button, TextInput, Modal, ModalProps } from "@mantine/core";
import { AuthGuard } from "~/features/common";
import { User } from "~/server/models";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

interface EditUserModalProps extends Omit<ModalProps, "children"> {
  userData: any;
  onClose: () => void;
}

export default function EditPersonalInformationModal({
  userData,
  onClose,
  opened,
}: EditUserModalProps) {

  const form = useForm<User>({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      username: (value) => (value.length >= 3 ? null : "Username too short"),
      password: (value) => (value.length >= 8 ? null : "Password too short"),
    },
  });

  console.log(userData)

  useEffect(() => {
    form.setValues({
      username: userData.username,
      firstName: userData.first,
      lastName: userData.last,
      email: userData.email,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const handleSubmit = async (values: User) => {

  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Personal Information"
      centered
      styles={{
        title: {
          fontWeight: "bold",
        },
      }}
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
                  {...form.getInputProps("email")}
                  className="my-2"
                  label="Email Address"
                  radius="md"
                  size="md"
                  withAsterisk
                  maxLength={8}
                />
                <TextInput
                  {...form.getInputProps("username")}
                  className="my-2"
                  label="Username"
                  radius="md"
                  size="md"
                  withAsterisk
                />
                <Box className="flex my-2">
                  <TextInput
                    {...form.getInputProps("firstName")}
                    className="mr-2"
                    label="First Name"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                  <TextInput
                    {...form.getInputProps("lastName")}
                    className="ml-2"
                    label="Last Name"
                    radius="md"
                    size="md"
                    withAsterisk
                  />
                </Box>
                <Button
                  className="bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm my-2"
                  radius="md"
                >
                  Save User
                </Button>
              </Box>
            </Box>
          </Box>
        </AuthGuard>
      </form>
    </Modal>
  );
}
