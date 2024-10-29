import React, { useEffect, useState } from "react";
import {
  BackgroundImage,
  Image,
  Center,
  Text,
  Box,
  TextInput,
  PasswordInput,
  Button,
} from "@mantine/core";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { signIn, useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleSubmit = async (values: LoginFormValues) => {
    console.log("values", values);

    try {
      setLoading(true);

      const res = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      console.log(res);

      if (res?.ok === false) {
        showNotification({
          color: "red",
          title: "Error",
          message: "Invalid username or password",
        });

        return;
      }

      router.push("/");

      setLoading(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
      <Box>
        <BackgroundImage
          src="images/LoginBackground.png"
          radius="sm"
          className="flex items-center justify-center w-full min-h-screen"
        >
          <Center className="flex flex-col bg-[#f6f5f8] w-full max-w-[330px] sm:max-w-[330px] md:max-w-[450px] lg:max-w-[450px] rounded-lg drop-shadow-lg px-[20px] sm:px-[20px] md:px-[50px] lg:px-[50px] py-[30px] sm:py-[30px] md:py-[50px] lg:py-[50px]">
            <Link href="/">
              <Image
                className="w-full max-w-[230px]"
                src="images/home_icon2.png"
                alt="Logo"
              />
            </Link>

            <Box className="w-full flex flex-col justify-center items-center max-w-[400px]">
              <Text className="mb-5 text-xl font-bold mt-9" color="#000000">
                Login to Your Account
              </Text>
              <TextInput
                {...form.getInputProps("username")}
                required
                className="w-full my-5 drop-shadow-lg"
                placeholder="Email or Username"
                radius="xl"
                size="lg"
                styles={{
                  input: {
                    border: "none",
                    fontSize: "14px",
                  },
                }}
              />
              <PasswordInput
                {...form.getInputProps("password")}
                required
                className="w-full my-5 drop-shadow-lg"
                placeholder="Password"
                radius="xl"
                size="lg"
                styles={{
                  input: {
                    border: "none",
                  },
                  innerInput: {
                    fontSize: "14px",
                  },
                }}
              />
              <Button
                loading={loading}
                type="submit"
                w="100%"
                size="md"
                radius="xl"
              >
                Login
              </Button>
              <Box className="flex text-sm text-[#969696] mt-4">
                <Text>Do Not Have a Account ?</Text>
                <Link href="/register" className="font-bold">
                  &nbsp;Sign Up
                </Link>
              </Box>
            </Box>
          </Center>
        </BackgroundImage>
      </Box>
    </form>
  );
}
