import { Box } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

export const AdminNavBar = () => {
  const router = useRouter();
  return (
    <Box className="bg-[#232323] w-full flex flex-col sm:flex-col lg:flex-row justify-center items-center rounded-lg">
      <Link
        href="/admin/user"
        style={{
          color: router.pathname === "/admin/user" ? "#ffc700" : "white",
        }}
        className="text-xl lg:text-2xl font-bold text-white hover:text-[#ffc700] duration-200 py-4 mx-10"
      >
        Manage User
      </Link>
      <Link
        style={{
          color: router.pathname === "/admin/product" ? "#ffc700" : "white",
        }}
        href="/admin/product"
        className="text-xl lg:text-2xl font-bold hover:text-[#ffc700] duration-200 py-4 mx-10"
      >
        Manage Product
      </Link>
      <Link
        style={{
          color: router.pathname === "/admin/order" ? "#ffc700" : "white",
        }}
        href="/admin/order"
        className="text-xl lg:text-2xl font-bold text-white hover:text-[#ffc700] duration-200 py-4 mx-10"
      >
        Orders
      </Link>
    </Box>
  );
};
