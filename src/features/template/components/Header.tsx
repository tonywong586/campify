import {
  createStyles,
  Header,
  Group,
  Button,
  UnstyledButton,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  Image,
  rem,
  clsx,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ShoppingCart } from "tabler-icons-react";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("lg")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
      }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("lg")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("lg")]: {
      display: "none",
    },
  },
}));

export function HeaderMegaMenu() {
  const { pathname } = useRouter();
  const { data: session } = useSession();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <Box>
      <Header
        className="bg-[#232323]  border-[0px] lg:px-[4rem]"
        height={80}
        px="md"
      >
        <Group position="apart" sx={{ height: "100%" }}>
          <Group w={150}>
            <Link href="/">
              <Image
                className="object-cover"
                src="../images/home_icon.png"
                alt="home_icon"
                width={150}
              />
            </Link>
          </Group>
          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link
              href="/"
              className={clsx(
                "text-white duration-200 text-lg h-10 hover:-translate-y-1 mr-1 rounded-md hover:bg-[#FFC700]",
                classes.link,
                pathname === "/" ? "bg-[#FFC700]" : ""
              )}
            >
              Home
            </Link>
            <Link
              href="/aboutUs"
              className={clsx(
                "text-white duration-200 text-lg h-10 hover:-translate-y-1 mr-1 rounded-md hover:bg-[#FFC700]",
                classes.link,
                pathname === "/aboutUs" ? "bg-[#FFC700]" : ""
              )}
            >
              About Us
            </Link>
            {session && session.user.admin && (
              <Link
                href="/admin/user"
                className={clsx(
                  "text-white duration-200 text-lg h-10 hover:-translate-y-1 mr-1 rounded-md hover:bg-[#FFC700] ",
                  classes.link,
                  pathname === "/admin/user" ||
                    pathname === "/admin/product" ||
                    pathname === "/admin/order"
                    ? "bg-[#FFC700]"
                    : ""
                )}
              >
                Admin Dashboard
              </Link>
            )}
            {session && (
              <Link
                href="/profile?type=personal"
                className={clsx(
                  "text-white duration-200 text-lg h-10 hover:-translate-y-1 mr-1 rounded-md hover:bg-[#FFC700]",
                  classes.link,
                  pathname === "/profile" ? "bg-[#FFC700]" : ""
                )}
              >
                Welcome, {session?.user.username}
              </Link>
            )}

            {session && (
              <Link
                href="/cart"
                className={clsx(
                  "text-white text-lg duration-150 hover:bg-yellow-500 h-10 rounded-md hover:-translate-y-1",
                  classes.link,
                  pathname === "/cart" ? "bg-[#FFC700]" : ""
                )}
              >
                <ShoppingCart size={25} strokeWidth={2} color={"white"} />
              </Link>
            )}

            {!session && (
              <Link
                href="/login"
                className={clsx(
                  "text-white duration-200 text-lg h-10 hover:-translate-y-1 mr-1 rounded-md hover:bg-[#FFC700]",
                  classes.link
                )}
              >
                Login
              </Link>
            )}
          </Group>

          {!session && (
            <Group className={classes.hiddenMobile}>
              <Link passHref href="/register">
                <Button className="text-base transition-all duration-200 bg-yellow-500 hover:bg-white hover:text-yellow-500 hover:border hover:border-yellow-500">
                  Sign up
                </Button>
              </Link>
            </Group>
          )}

          <Burger
            color="white"
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        withOverlay
        size="100%"
        className={classes.hiddenDesktop}
        zIndex={1000000}
        title={!session ? "Menu" : `Welcome, ${session?.user.username}`}
        styles={(theme) => ({
          overlay: {
            backgroundColor: theme.colorScheme === "dark" ? "dark.8" : "gray.0",
          },
          header: {
            background: "#232323",
            color: "white",
            paddingTop: 30,
          },
          body: {
            background: "#232323",
            color: "white",
          },
          close: {
            color: "white",
            width: 30,
            height: 30,
          }
        })}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color="white" />
          <Link
            href="/"
            className={clsx(
              "text-white font-normal hover:bg-[#FFC700] duration-150 hover:text-black text-lg justify-center",
              classes.link,
              pathname === "/" ? "bg-[#FFC700]" : ""
            )}
          >
            Home
          </Link>
          <Link
            href="/aboutUs"
            className={clsx(
              "text-white font-normal hover:bg-[#FFC700] duration-150 hover:text-black text-lg justify-center",
              classes.link,
              pathname === "/aboutUs" ? "bg-[#FFC700]" : ""
            )}
          >
            About Us
          </Link>
          {session && (
            <Link
              href="/profile?type=personal"
              className={clsx(
                "text-white font-normal hover:bg-[#FFC700] duration-150 hover:text-black text-lg justify-center",
                classes.link,
                pathname === "/profile" ? "bg-[#FFC700]" : ""
              )}
            >
              Profile
            </Link>
          )}

          {session && (
            <Link
              href="/cart"
              className={clsx(
                "text-white font-normal hover:bg-[#FFC700] duration-150 hover:text-black text-lg justify-center",
                classes.link,
                pathname === "/cart" ? "bg-[#FFC700]" : ""
              )}
            >
              Shopping Cart
            </Link>
          )}

          {session && session.user.admin && (
            <Link
              href="/admin/user"
              className={clsx(
                "text-white font-normal hover:bg-[#FFC700] duration-150 hover:text-black text-lg justify-center",
                classes.link,
                pathname === "/admin/user" ? "bg-[#FFC700]" : ""
              )}
            >
              Admin Dashboard
            </Link>
          )}
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          {
            !session ?
              <Group position="center" grow pb="xl" px="md">
                <Link
                  href="/login"
                  className="bg-[#FFC700] w-[150px] h-[40px] hover:bg-[#387D6B] duration-150 text-sm text-white font-bold flex justify-center items-center rounded-sm"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-[#fff] w-[150px] h-[40px] hover:bg-[#000] hover:text-white duration-150 text-sm text-black font-bold flex justify-center items-center rounded-sm"
                >
                  Sign up
                </Link>
              </Group> :
              <Group position="center" grow pb="xl" px="md">
                <UnstyledButton
                  onClick={handleSignOut}
                  className="bg-[#FFC700] w-[150px] h-[40px] hover:bg-[#FFC700] duration-150 text-sm text-white font-bold flex justify-center items-center rounded-sm"
                >
                  Sign Out
                </UnstyledButton>
              </Group>
          }
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
