import { Container, Group, Stack, rem, Image, Button, Select, Box, Rating } from "@mantine/core";
import { HeroContainer } from "~/features/common";
import { HeaderMegaMenu } from "~/features/template/components/Header";
import { Carousel } from '@mantine/carousel';
import { ChevronLeft, ChevronRight, ChevronDown, ShoppingCart } from 'tabler-icons-react';
import { useState } from "react";
import { DateInput } from '@mantine/dates';
import dayjs from "dayjs";

export default function Product() {
    const [value, setValue] = useState<Date | null>(null);
    const [value2, setValue2] = useState<Date | null>(null);

    return (
        <Stack className="w-full bg-[#F6F5F8] overflow-x-hidden">
            <HeaderMegaMenu />
            <Container className="mt-10 flex flex-col sm:flex-col md:flex-row lg:flex-row w-full">
                <Box className="bg-white rounded-2xl rounded-r-none lg:rounded-r-2xl shadow-gray-300 mb-10 sm:mb-10 md:mb-0 lg:mb-0 lg:mr-5">
                    <Carousel
                        maw={500}
                        mah={500}
                        controlSize={40}
                        loop
                        mx="auto"
                        withIndicators
                        getEmblaApi={(embla) => console.log(embla)}
                        styles={{
                            indicator: {
                                width: rem(12),
                                backgroundColor: '#ffc700',
                                border: '1px solid #ffc700',
                                height: rem(4),
                                transition: 'width 250ms ease',
                                '&[data-active]': {
                                    width: rem(40),
                                },
                            },
                            controls: {
                                button: {
                                    padding: rem(10),
                                    backgroundColor: 'black',
                                    color: 'white',
                                    border: 'none',
                                    '&:hover': {
                                        backgroundColor: 'black',
                                    },
                                },
                            },
                            slide: {
                                padding: rem(50),
                            },
                        }}
                    >
                        <Carousel.Slide>
                            <Image src="/images/Logo.png" alt="Product" className="max-w-lg" />
                        </Carousel.Slide>
                        <Carousel.Slide>
                            <Image src="/images/product.png" alt="Product" />
                        </Carousel.Slide>
                        <Carousel.Slide>
                            <Image src="/images/product.png" alt="Product" />
                        </Carousel.Slide>
                        {/* ...other slides */}
                    </Carousel>
                </Box>
                <Box className="bg-white rounded-2xl rounded-l-none lg:rounded-l-2xl shadow-gray-300 p-10 lg:ml-5">
                    <Box className="text-xl font-bold my-2"> Loowoko 50L Hiking Backpack</Box>
                    <Box className="text-md text-[#9D9D9D] my-2"> - Hiking Backpack</Box>
                    <Box className="my-2">
                        <Rating fractions={2} defaultValue={3.75}
                            color="red"
                        />
                    </Box>
                    <Box className="flex flex-row justify-start my-2 items-center space-x-px">
                        <Box className="color-section flex my-2">
                            <DateInput
                                minDate={new Date()}
                                maxDate={dayjs(new Date()).add(1, 'month').toDate()}
                                className='mr-2'
                                value={value}
                                onChange={setValue}
                                label="Pickup Date"
                                placeholder="Date input"
                                radius="md"
                                size="md"
                                maw={400}
                                mx="auto"
                            />
                            <DateInput
                                minDate={new Date()}
                                maxDate={dayjs(new Date()).add(1, 'month').toDate()}
                                className='ml-2'
                                value={value2}
                                onChange={setValue2}
                                label="Return Date"
                                placeholder="Date input"
                                radius="md"
                                size="md"
                                maw={400}
                                mx="auto"
                            />
                        </Box>
                    </Box>
                    <Box className="my-2 flex item-center">
                        <span className="pr-2 font-bold">Price:</span>
                        <span className="">$500HKD</span>
                    </Box>
                    <Box className="my-2">
                        <Button className="radius='md' w={120} h={40}">
                            <ShoppingCart
                                size={18}
                                strokeWidth={2}
                                color={'white'}
                            />&nbsp;Add to Cart
                        </Button>
                    </Box>
                </Box>
            </Container>
            <Container className="mt-5 mb-10 flex w-full">
                <Box className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-gray-300 p-10 w-full ">
                    <div className="text-2xl font-bold">
                        Descriptions
                    </div>
                    <div className="text-lg font leading-[35px] text-[#9D9D9D] pt-2 text-center">
                        Item type: Hiking Day pack
                        <br></br>
                        Capacity: 50L(45L+5L)
                        <br></br>
                        Load-Bearing: 40KG(88lb)
                        <br></br>
                        Size: . 65* 35 * 25cm / 25.6 * 13.8 * 9.8in
                        <br></br>
                        Weight: 1200g / 2.6 pounds
                        <br></br>
                        package Size: 22.28x14.72x2.75in
                    </div>
                </Box>
            </Container>
        </Stack>
    );
}
