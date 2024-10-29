import React, { useEffect } from "react";
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
import { trpc } from "~/utils/trpc";
import { User } from "~/server/models";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
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

  const [loading, setLoading] = React.useState(false);

  const { mutateAsync: register } = trpc.user.register.useMutation();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleSubmit = async (values: User) => {
    setLoading(true);

    try {
      const res = await register(values);

      if (res) {
        await signIn("credentials", {
          username: values.username,
          password: values.password,
          redirect: false,
        });

        router.push("/");
      }
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
                Register Your Account
              </Text>
              <TextInput
                {...form.getInputProps("email")}
                className="w-full mt-5 mb-4 drop-shadow-lg"
                placeholder="Email Address"
                type="email"
                radius="xl"
                required
                size="lg"
                styles={{
                  input: {
                    border: "none",
                    fontSize: "14px",
                  },
                }}
              />

              <Box className="flex mb-4">
                <TextInput
                  {...form.getInputProps("firstName")}
                  className="w-full mr-2 drop-shadow-lg"
                  placeholder="First Name"
                  required
                  min={3}
                  max={20}
                  radius="xl"
                  size="lg"
                  styles={{
                    input: {
                      border: "none",
                      fontSize: "14px",
                    },
                  }}
                />
                <TextInput
                  {...form.getInputProps("lastName")}
                  className="w-full ml-2 drop-shadow-lg"
                  placeholder="Last Name"
                  required
                  min={3}
                  max={20}
                  radius="xl"
                  size="lg"
                  styles={{
                    input: {
                      border: "none",
                      fontSize: "14px",
                    },
                  }}
                />
              </Box>

              <TextInput
                {...form.getInputProps("username")}
                className="w-full mb-4 drop-shadow-lg"
                placeholder="Username"
                required
                min={3}
                max={20}
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
                className="w-full mb-4 drop-shadow-lg"
                placeholder="Password"
                radius="xl"
                required
                min={8}
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
                type="submit"
                w="100%"
                size="md"
                radius="xl"
                loading={loading}
              >
                Register
              </Button>
              <Box className="flex text-sm text-[#969696] mt-4">
                <Text>Already Have a Account ?</Text>
                <Link href="/login" className="font-bold">
                  &nbsp;Login
                </Link>
              </Box>
            </Box>
          </Center>
        </BackgroundImage>
      </Box>
    </form>
  );
}
