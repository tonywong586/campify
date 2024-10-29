import React, { useState, useEffect } from "react";
import { Box, Button, Text, Modal, ModalProps, Image, FileInput } from "@mantine/core";
import { AuthGuard } from "~/features/common";
import { User } from "~/server/models";
import { useForm } from "@mantine/form";

interface EditUserModalProps extends Omit<ModalProps, "children"> {
    checkOutData: any;
    paymentMethod: string;
    onClose: () => void;
}

export default function CheckOutModal({
    checkOutData,
    paymentMethod,
    onClose,
    opened,
}: EditUserModalProps) {

    const [nextButton, setNextButton] = useState(false);

    useEffect(() => {
        setNextButton(false);
    }, [opened]);

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

    };

    return (
        <Modal opened={opened} onClose={onClose} centered>
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
                                {
                                    nextButton === false ?
                                        <>
                                            <Box>
                                                <Text className="font-bold text-2xl">Address Detail:</Text>
                                                <Text className="text-[#9D9D9D]">Street: {checkOutData.street}</Text>
                                                <Text className="text-[#9D9D9D]">Building: {checkOutData.building}</Text>
                                                <Text className="text-[#9D9D9D]">Block: {checkOutData.block}</Text>
                                                <Text className="text-[#9D9D9D]">Floor: {checkOutData.floor}</Text>
                                                <Text className="text-[#9D9D9D]">Room: {checkOutData.room}</Text>
                                            </Box>
                                            <Box className="mt-2">
                                                <Text className="font-bold text-2xl mb-2">Payment Method: {checkOutData.payment}</Text>
                                                {
                                                    paymentMethod === "cash" ?
                                                        <Text className="text-[#9D9D9D] text-justify mb-2">Pay for cash upon delivery</Text> :
                                                        <Text className="text-[#9D9D9D] text-justify mb-2">Scan the following QR Code to pay. Please click next and upload the screen capture for verification then click checkout for the complete order.</Text>
                                                }
                                                {
                                                    paymentMethod === "fps" ?
                                                        <Image src="/images/FPSQRCode.png" alt="Payment Code" width={200} height={200} className="mb-2" /> :
                                                        paymentMethod === "payme" ?
                                                            <Image src="/images/PaymeQRCode.png" alt="Payment Code" width={200} height={200} className="mb-2" /> :
                                                            null
                                                }
                                            </Box>
                                        </> :
                                        paymentMethod !== "cash" ?
                                            <FileInput
                                                accept="image/png, image/jpeg"
                                                required
                                                className="my-2"
                                                label="Verification Images"
                                                radius="md"
                                                size="md"
                                                placeholder="Upload files"
                                                multiple
                                            /> : <Text className="text-[#9D9D9D] text-justify mb-2">Confirm and click check out.</Text>
                                }
                                {
                                    nextButton === false ?
                                        <Button
                                            onClick={() => setNextButton(true)}
                                            className="bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm my-2"
                                            radius="md"
                                        >
                                            Next
                                        </Button> :
                                        <>
                                            <Button
                                                className="bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm my-2 mr-2"
                                                radius="md"
                                            >
                                                Check Out
                                            </Button>
                                            <Button
                                                onClick={() => setNextButton(false)}
                                                className="bg-[#315E52] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm my-2 ml-2"
                                                radius="md"
                                            >
                                                Back
                                            </Button>
                                        </>
                                }
                            </Box>
                        </Box>
                    </Box>
                </AuthGuard>
            </form>
        </Modal>
    );
}
