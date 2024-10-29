import {
  Container,
  Stack,
  rem,
  Image,
  Button,
  Box,
  LoadingOverlay,
  Avatar,
  Text,
  Rating,
  Textarea,
  Group,
} from "@mantine/core";
import { HeaderMegaMenu } from "~/features/template/components/Header";
import { Carousel } from "@mantine/carousel";
import { ShoppingCart } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { categoryToString } from "~/utils/category";
import { useSession } from "next-auth/react";
import { Product, ProductDoc, UserDoc } from "~/server/models";
import { Form, useForm } from "@mantine/form";
import { calcDays } from "~/utils/misc";
import { UserComment } from "~/features/common/components/UserComment";
interface ProductFormValues {
  rentStartDate: Date | null;
  rentEndDate: Date | null;
}

interface ReviewComment {
  productId: string;
  rating: number;
  comment: string;
}

export default function Product() {
  const trpcUtils = trpc.useContext();
  const router = useRouter();
  const { data: session } = useSession();
  const [rentDays, setRentDays] = useState(0);

  const cartAdd = trpc.cart.add.useMutation();
  const { mutateAsync: create } = trpc.review.create.useMutation();
  const { mutateAsync: update } = trpc.product.update.useMutation();

  const { data: product, isFetching: isFetchingProduct } =
    trpc.product.get.useQuery({
      id: router.query.id as string,
    });
  const {
    data: reviews,
    refetch: refetchReviews,
    isFetching: isFetchingReviews,
  } = trpc.review.get.useQuery({ productId: router.query.id as string });
  console.log("reviews", reviews);

  const rows = reviews?.map((element) => (
    <UserComment
      key={element._id.toString()}
      name={element.user.username}
      comment={element.comment}
      rating={element.rating}
      date={element.createdAt!.toString()}
      avatar={element.user.username}
      id={"1"}
    />
  ));

  const form = useForm<ProductFormValues>({
    initialValues: {
      rentStartDate: null,
      rentEndDate: null,
    },
  });

  const form2 = useForm<ReviewComment>({
    initialValues: {
      productId: "",
      rating: 0,
      comment: "",
    },
  });

  //Calculate rent days
  useEffect(() => {
    if (form.values.rentStartDate && form.values.rentEndDate) {
      setRentDays(calcDays(form.values.rentStartDate, form.values.rentEndDate));
    }
  }, [form.values.rentStartDate, form.values.rentEndDate]);

  const handleAddToCart = async (value: ProductFormValues) => {
    if (!product) return;

    if (product.rental && !value.rentStartDate && !value.rentEndDate) return;

    const { rentStartDate, rentEndDate } = value;

    const rentDuration = {
      start: rentStartDate!,
      end: rentEndDate!,
    };

    const res = await cartAdd.mutateAsync({
      productId: product._id,
      rentDuration: product.rental ? rentDuration : undefined,
    });

    await trpcUtils.cart.list.invalidate();

    router.push("/cart");

    if (res) {
      console.log("addTocChart", res);
    }
  };

  const handleReview = async (value: ReviewComment) => {
    if (!product) return;
    console.log("value", value);
    const res = await create({
      productId: product._id,
      rating: value.rating,
      comment: value.comment,
    });

    if (res) {
      console.log("addTocChart", res);
      await trpcUtils.review.get.invalidate({ productId: product._id });
      form2.reset();
    }
  };

  return (
    <div>
      <Stack className="w-full bg-[#F6F5F8] h-min-screen overflow-x-hidden">
        <HeaderMegaMenu />

        <Container
          className="flex flex-col w-full mt-10 sm:flex-col md:flex-row lg:flex-row"
          pos="relative"
        >
          <LoadingOverlay visible={isFetchingProduct} />
          <Box className="mb-10 bg-white rounded-r-lg md:rounded-r-none rounded-2xl lg:rounded-r-2xl shadow-gray-300 sm:mb-10 md:mb-0 lg:mb-0 lg:mr-5">
            <Carousel
              maw={500}
              mah={500}
              key={product?.images.length}
              controlSize={40}
              loop
              mx="auto"
              withIndicators
              styles={{
                indicator: {
                  width: rem(12),
                  backgroundColor: "#ffc700",
                  border: "1px solid #ffc700",
                  height: rem(4),
                  transition: "width 250ms ease",
                  "&[data-active]": {
                    width: rem(40),
                  },
                },
                controls: {
                  button: {
                    padding: rem(10),
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "black",
                    },
                  },
                },
                slide: {
                  padding: rem(60),
                },
              }}
            >
              {product?.images.map((image, i) => (
                <Carousel.Slide key={i}>
                  <Image
                    src={image}
                    alt="Product Image"
                    className="object-cover"
                    width={320}
                    height={320}
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          </Box>
          <form onSubmit={form.onSubmit((v) => handleAddToCart(v))}>
            <Box className="flex flex-col items-start md:w-[500px] justify-center w-full p-10 bg-white rounded-l-2xl rounded-2xl md:rounded-l-none lg:rounded-l-2xl shadow-gray-300 lg:ml-5">
              <Box className="my-2 text-xl font-bold">{product?.name}</Box>
              <Box className="text-md text-[#9D9D9D] my-2">
                - {categoryToString(product?.category ?? "")}
              </Box>
              <Box className="my-2">
                <Rating fractions={4} readOnly defaultValue={3.75} />
              </Box>

              <Box className="flex flex-row items-center justify-start my-2 space-x-px w-f">
                {product?.rental && (
                  <Stack>
                    <Box className="flex my-2 color-section">
                      <DateInput
                        required
                        minDate={new Date()}
                        maxDate={dayjs(new Date()).add(1, "month").toDate()}
                        className="mr-2"
                        {...form.getInputProps("rentStartDate")}
                        label="Pickup Date"
                        placeholder="Date input"
                        radius="md"
                        size="md"
                        maw={400}
                        mx="auto"
                      />
                      <DateInput
                        disabled={form.values.rentStartDate === null}
                        required
                        minDate={
                          form.values.rentStartDate
                            ? dayjs(form.values.rentStartDate)
                              .add(1, "day")
                              .toDate()
                            : new Date()
                        }
                        maxDate={dayjs(new Date()).add(1, "month").toDate()}
                        className="ml-2"
                        {...form.getInputProps("rentEndDate")}
                        label="Return Date"
                        placeholder="Date input"
                        radius="md"
                        size="md"
                        maw={400}
                        mx="auto"
                      />
                    </Box>

                    <Text ta="center" className="text-base text-[#969696]">
                      Rent Days: {rentDays} days
                    </Text>
                  </Stack>
                )}
              </Box>
              <Box className="flex my-2 item-center">
                <span className="pr-2 font-bold">Price:</span>
                <span className="">
                  ${product?.price} HKD
                  {product?.rental && " / day"}
                </span>
              </Box>
              <Box className="flex my-2 item-center">
                <span className="pr-2 font-bold">Stock:</span>
                <span className="">{product?.quantity} left</span>
              </Box>
              <Box className="my-2">
                {session && (
                  <Button
                    leftIcon={
                      <ShoppingCart size={18} strokeWidth={2} color={"white"} />
                    }
                    disabled={product?.quantity === 0}
                    loading={cartAdd.isLoading}
                    className="radius='md' w={120} h={40}"
                    type="submit"
                  >
                    Add to Cart
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Container>
        <Container className="flex flex-col w-full mt-5 mb-10">
          <Box className="flex flex-col items-center justify-center w-full p-10 bg-white rounded-2xl shadow-gray-300 ">
            <div className="text-2xl font-bold">Descriptions</div>
            <div className="text-lg font leading-[35px] text-[#9D9D9D] pt-2 text-center">
              {product?.description}
            </div>
          </Box>
          <div className="pt-4 pb-4 text-2xl font-bold">User Comment</div>
          {session && (
            <Box className="flex flex-col items-start justify-center w-full p-6 bg-white rounded-2xl shadow-gray-300 ">
              <div className="flex flex-row items-start w-full text-lg font leading-[35px] text-[#9D9D9D] text-center">
                <Avatar
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${session?.user.username}`}
                  variant="filled"
                  radius="100%"
                  w={38}
                  mr={16}
                  color="red"
                ></Avatar>
                <form
                  onSubmit={form2.onSubmit((v) => handleReview(v))}
                  className="flex flex-col justify-start w-full h-full"
                >
                  <div className="pb-2 font-bold text-black text-start">
                    {session?.user.username}
                  </div>
                  <Textarea
                    {...form2.getInputProps("comment")}
                    autosize
                    minRows={3}
                    maxRows={5}
                    placeholder="Your comment"
                    withAsterisk
                  />
                  <Rating
                    {...form2.getInputProps("rating")}
                    fractions={2}
                    defaultValue={5}
                    className="py-2"
                  />
                  <Group>
                    <Button type="submit" className="max-w-[80px] mt-2">
                      Send
                    </Button>
                  </Group>
                </form>
              </div>

              <div className="flex flex-col w-full">{rows}</div>
            </Box>
          )}
        </Container>
      </Stack>
    </div>
  );
}
