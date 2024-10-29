/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { HeaderMegaMenu } from "~/features/template/components/Header";
import { Stack, Container, Group, Box } from "@mantine/core";
import Image from "next/image";
import { IconDrawing } from "~/features/common/components/IconDrawing";
import { Mail, Phone } from "tabler-icons-react";

export default function aboutUs() {
  return (
    <div>
      <Stack className="w-full bg-[#F6F5F8] overflow-x-hidden">
        <HeaderMegaMenu />
        <div className="flex flex-col items-center justify-center">
          <IconDrawing />
          <Stack className="max-w-[800px] bg-white rounded-lg p-8 m-8 mb-20 mt-0">
            <span className=" font-semibold text-lg text-[#315E52] hover:text-3xl">
              Welcome to Campify
            </span>
            <p className="my-0">
              we are a camping company based in Hong Kong! We are a team of
              camping enthusiasts who are dedicated to provide high-quality
              camping products and services to our customers.
            </p>
            <p className="my-0">
              At Campify, we offer a wide range of camping products for both
              sale and rent, including tents, sleeping bags, backpacks, camping
              stoves, and more. We believe that everyone should have the
              opportunity to experience the great outdoors and enjoy the beauty
              of nature, which is why we offer affordable pricing for all of our
              products.
            </p>
            <p className="my-0">
              We are committed to promoting responsible and sustainable camping
              practices. We encourage our customers to practice Leave No Trace
              principles, and we offer eco-friendly camping products and options
              whenever possible.
            </p>
            <p className="my-0">
              Our team at Campify is made up of experienced camping experts who
              are always happy to provide advice and guidance to our customers.
              Whether you're a seasoned camper or new to the world of camping,
              we're here to help you make the most of your outdoor adventure.
            </p>
            <p className="my-0">
              If you have any questions about our products or services, please
              don't hesitate to contact us and we'll get back to you as soon as
              possible.
            </p>
            <p className="my-0">
              Thank you for considering Campify for your camping needs. We look
              forward to helping you make your next camping trip a success!
            </p>
            <Box className="w-full text-md md-text-xl space-y-3 bg-[#315E52] rounded-lg p-4">
              <div className="flex flex-row items-center my-0 text-white">
                <Mail
                  size={28}
                  strokeWidth={2}
                  color={"white"}
                  className="mr-2"
                />
                campify@gmail.com
              </div>
              <div className="flex items-center my-0 text-white">
                <Phone
                  size={28}
                  strokeWidth={2}
                  color={"white"}
                  className="mr-2"
                />
                12345678
              </div>
            </Box>
          </Stack>
        </div>
      </Stack>
    </div>
  );
}
