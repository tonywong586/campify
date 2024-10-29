import React from 'react'
import {
    Box,
    Button,
    TextInput,
    FileInput,
    PasswordInput,
    Modal,
    ModalProps,
} from "@mantine/core";
import { trpc } from '~/utils/trpc'
import { useForm } from "@mantine/form";
import { User } from "~/server/models";

interface AddUserModalProps extends Omit<ModalProps, "children"> {
    onClose: () => void;
}

export default function AddUser({
    opened,
    onClose,
}: AddUserModalProps) {
    const { mutateAsync: register } = trpc.user.register.useMutation();
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

    const handleSubmit = async (values: User) => {
        // setLoading(true);
        console.log("here");
        try {
            const res = await register(values);

            if (res) {
                console.log(res);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title={`Add User`} centered>
            <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
                <Box className='bg-[#F6F5F8]'>
                    {/* Table */}
                    <Box className='bg-white rounded-lg'>
                        <Box>

                            <TextInput
                                {...form.getInputProps("email")}
                                className='my-2'
                                placeholder=""
                                label="Email Address"
                                radius="md"
                                size="md"
                                withAsterisk
                            />
                            <Box className='flex my-2'>
                                <TextInput
                                    {...form.getInputProps("firstName")}
                                    className='mr-2'
                                    placeholder=""
                                    label="First Name"
                                    radius="md"
                                    size="md"
                                    withAsterisk
                                />
                                <TextInput
                                    {...form.getInputProps("lastName")}
                                    className='ml-2'
                                    placeholder=""
                                    label="Last Name"
                                    radius="md"
                                    size="md"
                                    withAsterisk
                                />
                            </Box>
                            <TextInput
                                {...form.getInputProps("username")}
                                className='my-2'
                                placeholder=""
                                label="Username"
                                radius="md"
                                size="md"
                                withAsterisk
                            />
                            <PasswordInput
                                {...form.getInputProps("password")}
                                className='my-2'
                                placeholder=""
                                label="Password"
                                radius="md"
                                size="md"
                                withAsterisk
                            />
                            <FileInput className='my-2' label="Profile Image" radius="md"
                                size="md" placeholder="Upload files" />
                            <Button type="submit" className='bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm my-2' radius="md">Add User</Button>
                        </Box>
                    </Box>
                </Box>
            </form>
        </Modal>
    )
}
