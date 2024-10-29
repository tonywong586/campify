import { HeaderMegaMenu } from "~/features/template/components/Header";
import {
    Container,
    Stack,
    Text,
    Table,
    Image,
    Button,
    Box,
    TextInput,
    LoadingOverlay,
    NumberInput,
    Group,
    ActionIcon,
    NumberInputHandlers,
    rem
} from "@mantine/core";
import { AuthGuard } from "~/features/common";
import { Trash } from "tabler-icons-react";
import { useState, useEffect, useRef } from "react";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { trpc } from "~/utils/trpc";
import Link from "next/link";
import { calcDays, formatDate } from "~/utils/misc";
import { CartItemDoc, PaymentType } from "~/server/models";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "~/features/common/components/CheckoutForm";
import { useForm } from "@mantine/form";
import { Address } from "~/server/models";
import CheckOutModal from "~/features/common/components/CheckOutModal";
import { StrapiCheckoutModal } from "~/features/common/components/StrapiCheckoutModal";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Cart() {
    const trpcUtils = trpc.useContext();
    const [opened, { open, close }] = useDisclosure(false);
    const [opened2, { open: open2, close: close2 }] = useDisclosure(false);

    const { data: cartData, isFetching: isFetchingCart } =
        trpc.cart.list.useQuery();

    const deleteCartItem = trpc.cart.delete.useMutation();

    const { mutateAsync: checkout, isLoading: isCheckoutLoading } =
        trpc.cart.checkout.useMutation();

    const [paymentMethod, setPaymentMethod] = useState<PaymentType>("others");

    const form = useForm<Address>({
        initialValues: {
            street: "",
            building: "",
            block: "",
            floor: "",
            room: "",
        },
    });

    const [checkOutData, setCheckOutData] = useState({
        street: "",
        building: "",
        block: "",
        floor: "",
        room: "",
    });

    const [paymentIntent, setPaymentIntent] = useState<Stripe.PaymentIntent>();
    const [orderId, setOrderId] = useState("");
    const [value, setValue] = useState<number | ''>(0);
    const handlers = useRef<NumberInputHandlers>();

    const rows = cartData?.cartItems.map((item) => (
        <tr key={item._id.toString()} className="bg-white">
            <td>
                <Link href={`/product/${item.product._id}`}>
                    <Image
                        withPlaceholder
                        src={item.product.images[0]}
                        alt="product image"
                        width={70}
                        height={70}
                    />
                </Link>
            </td>
            <td>
                <Link href={`/product/${item.product._id}`}>{item.product.name}</Link>
            </td>
            <td>

                <NumberInput
                    hideControls
                    value={item.quantity}
                    onChange={(val) => setValue(val)}
                    handlersRef={handlers}
                    max={10}
                    min={0}
                    step={2}
                    styles={{ input: { width: rem(54), textAlign: 'center' } }}
                />
            </td>
            <td>{item.rental ? formatDate(item.rentDuration?.start!) : ""}</td>
            <td>
                {item.rental
                    ? formatDate(item.rentDuration?.end!) +
                    ` (${calcDays(
                        item.rentDuration?.start!,
                        item.rentDuration?.end!
                    )} days)`
                    : ""}
            </td>
            <td>${item.product.price}</td>
            <td>
                <Button
                    onClick={() => handleRemoveCart(item)}
                    className="bg-transparent hover:bg-transparent "
                >
                    <Trash size={30} strokeWidth={2} color={"#bf4040"} />
                </Button>
            </td>
        </tr>
    ));

    const handleRemoveCart = async (item: CartItemDoc) => {
        await deleteCartItem.mutateAsync({ id: item._id.toString() });

        showNotification({
            title: "Remove Cart Item",
            message: `You have removed ${item.product.name} from your cart`,
            color: "red",
        });

        trpcUtils.cart.list.invalidate();
    };

    const handleCheckout = async (address: Address) => {
        if (paymentMethod === "stripe") {
            const res = await checkout({
                paymentType: paymentMethod,
                address: {
                    street: address.street,
                    building: address.building,
                    block: address.block,
                    floor: address.floor,
                    room: address.room,
                },
            });

            setPaymentIntent(res.paymentIntent);

            setOrderId(res.order._id.toString());

            open();
        } else {
            setCheckOutData(form.values);
            open2();
        }
    };

    return (
        <>
            <form onSubmit={form.onSubmit((v) => handleCheckout(v))}>
                <AuthGuard>
                    <Stack className="w-full bg-[#F6F5F8]">
                        <HeaderMegaMenu />
                        <Container
                            className="flex w-full max-w-[1600px] min-h-screen flex-col"
                            mb="lg"
                        >
                            <Text className="my-10 text-3xl font-bold">Shopping Cart</Text>

                            <LoadingOverlay
                                visible={deleteCartItem.isLoading || isFetchingCart}
                            />

                            <Container className="w-full flex flex-col sm:flex-col md:flex-col lg:flex-row max-w-[1600px]">
                                <Box className="bg-white rounded-md p-10 mr-2 w-full lg:w-[60%] ">
                                    <Box className="h-[30rem] overflow-y-auto">
                                        <Table horizontalSpacing="sm" highlightOnHover>
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Name</th>
                                                    <th>Quantity</th>
                                                    <th>Pickup Date</th>
                                                    <th>Return Date</th>
                                                    <th>Price</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>{rows}</tbody>
                                        </Table>
                                    </Box>
                                    <Box>
                                        <div className="flex justify-between">
                                            <Text className="mt-10 text-xl font-bold">
                                                Total Price:
                                            </Text>

                                            <Text className="mt-10 text-xl font-bold">
                                                ${cartData?.totalPrice} HKD
                                            </Text>
                                        </div>
                                    </Box>
                                </Box>
                                <Box className="bg-white rounded-md mt-10 lg:mt-0 lg:ml-2 w-full lg:w-[40%] p-10 flex flex-col justify-start">
                                    <Text className="text-xl font-bold text-center">
                                        Delivery Address
                                    </Text>
                                    <Text className="text-md text-center text-[#9D9D9D]">
                                        Please input Delivery Address
                                    </Text>
                                    <TextInput
                                        className="my-2"
                                        placeholder=""
                                        label="Street Name"
                                        radius="md"
                                        size="md"
                                        required
                                        withAsterisk
                                        {...form.getInputProps("street")}
                                    />
                                    <TextInput
                                        className="my-2"
                                        placeholder=""
                                        label="Building Name"
                                        radius="md"
                                        size="md"
                                        required
                                        withAsterisk
                                        {...form.getInputProps("building")}
                                    />
                                    <Box className="flex my-2">
                                        <TextInput
                                            className="mr-2"
                                            placeholder=""
                                            label="Block"
                                            radius="md"
                                            size="md"
                                            {...form.getInputProps("block")}
                                        />
                                        <TextInput
                                            className="ml-2"
                                            placeholder=""
                                            label="Floor"
                                            radius="md"
                                            size="md"
                                            required
                                            withAsterisk
                                            {...form.getInputProps("floor")}
                                        />
                                        <TextInput
                                            className="ml-2"
                                            placeholder=""
                                            label="Room"
                                            radius="md"
                                            size="md"
                                            required
                                            {...form.getInputProps("room")}
                                        />
                                    </Box>

                                    <Box className="grid self-center grid-cols-1 gap-8 mt-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                                        <Button
                                            onClick={() => setPaymentMethod("fps")}
                                            className={`bg-white hover:bg-white rounded-md border-[1.8px] ${paymentMethod === "fps"
                                                ? "border-[#FFC700]"
                                                : "border-[#DCDCDC]"
                                                } hover:border-[#FFC700] duration-200 w-[10rem] h-[6rem]`}
                                        >
                                            <Image
                                                src="/images/FPS.png"
                                                alt="FPS"
                                                width={90}
                                                height={90}
                                            />
                                        </Button>
                                        <Button
                                            onClick={() => setPaymentMethod("payme")}
                                            className={`bg-white hover:bg-white rounded-md border-[1.8px] ${paymentMethod === "payme"
                                                ? "border-[#FFC700]"
                                                : "border-[#DCDCDC]"
                                                } hover:border-[#FFC700] duration-200 w-[10rem] h-[6rem]`}
                                        >
                                            <Image
                                                src="/images/Payme.png"
                                                alt="FPS"
                                                width={120}
                                                height={100}
                                            />
                                        </Button>
                                        <Button
                                            onClick={() => setPaymentMethod("stripe")}
                                            className={`bg-white hover:bg-white rounded-md border-[1.8px] ${paymentMethod === "stripe"
                                                ? "border-[#FFC700]"
                                                : "border-[#DCDCDC]"
                                                } hover:border-[#FFC700] duration-200 w-[10rem] h-[6rem]`}
                                        >
                                            <Image
                                                src="/images/Stripe.jpg"
                                                alt="FPS"
                                                width={90}
                                                height={50}
                                            />
                                        </Button>
                                        <Button
                                            onClick={() => setPaymentMethod("cash")}
                                            className={`bg-white hover:bg-white rounded-md border-[1.8px] ${paymentMethod === "cash"
                                                ? "border-[#FFC700]"
                                                : "border-[#DCDCDC]"
                                                } hover:border-[#FFC700] duration-200 w-[10rem] h-[6rem]`}
                                        >
                                            <Image
                                                src="/images/Cash.png"
                                                alt="FPS"
                                                width={90}
                                                height={100}
                                            />
                                        </Button>
                                    </Box>

                                    <Button
                                        type="submit"
                                        disabled={
                                            cartData?.cartItems.length === 0 ||
                                            paymentMethod === "others"
                                        }
                                        className="mt-10 duration-200"
                                        loading={isCheckoutLoading}
                                    >
                                        Checkout
                                    </Button>
                                </Box>
                            </Container>
                            <CheckOutModal
                                checkOutData={checkOutData}
                                paymentMethod={paymentMethod}
                                opened={opened2}
                                onClose={close2}
                            />
                        </Container>
                    </Stack>
                </AuthGuard>
            </form>

            <StrapiCheckoutModal
                orderId={orderId}
                paymentIntent={paymentIntent}
                opened={opened}
                onClose={close}
            />
        </>
    );
}
