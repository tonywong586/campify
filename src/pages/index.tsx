import { Image, Box, Text, Select, Skeleton } from "@mantine/core";

import { HeaderMegaMenu } from "~/features/template/components/Header";
import ProductCard from "~/features/template/components/ProductCard";
import Link from "next/link";
import { trpc } from "~/utils/trpc";
import { useEffect, useState } from "react";

export default function Home() {
  const [sorting, setSorting] = useState({
    column: "createdAt",
    sort: -1,
    category: "",
  });
  const {
    data: products,
    refetch: refetchProducts,
    isInitialLoading: isFetchingProducts,
  } = trpc.product.list.useQuery(sorting);
  // const { data: sortedDAta } = trpc.product.list.useQuery(sorting);

  const [loading, setLoading] = useState(true);

  const handleSorting = async (values: string) => {
    let column = "";
    let sort = 0;
    if (values === "highest_rate") {
      column = "rating";
    } else if (values === "highest_price") {
      column = "price";
      sort = -1;
    } else if (values === "lowest_price") {
      column = "price";
      sort = 1;
    }
    setSorting({ column: column, sort: sort, category: sorting.category });
    await refetchProducts();
  };

  const handleCategory = async (values: string) => {
    setSorting({ column: sorting.column, sort: sorting.sort, category: values });
    await refetchProducts();
  }



  return (
    <Box>
      {/* header */}
      <HeaderMegaMenu />
      <Box className="flex flex-col items-center justify-center overflow-x-hidden">
        {/* banner */}
        <Image className="object-cover w-full" src="images/Banner.png" alt="Logo" />
        {/* filter part */}
        <Box className="relative flex flex-col items-center justify-center w-full">
          {/* select section */}
          <Box className="bg-[#232323] w-full flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center items-center py-20">
            <Select
              className="px-[5rem] my-4 sm:my-4 lg:my-0"
              label="Sorting"
              placeholder="Select Sorting"
              onChange={(value) => { handleSorting(value!) }}
              data={[
                { value: "highest_rate", label: "Highest Rate" },
                { value: "highest_price", label: "Highest Price" },
                { value: "lowest_price", label: "Lowest Price" },
              ]}
              styles={{
                label: {
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "20px",
                },
                input: {
                  background: "transparent",
                  borderColor: "#fff",
                  height: "45px",
                  fontSize: "16px",
                  color: "#fff",
                  ":focus": {
                    borderColor: "#fff",
                  },
                  width: "350px",
                },
              }}
            />
            <Select
              className="px-[5rem] my-4 sm:my-4 lg:my-0"
              label="Category"
              placeholder="Select Category"
              onChange={(value) => { handleCategory(value!) }}
              data={[
                {
                  value: "dark_theme",
                  label: "Dark Theme",
                },
                {
                  value: "light_theme",
                  label: "Warm Theme",
                },
                {
                  value: "adventure_theme",
                  label: "Adventure Theme",
                },
                {
                  value: "relax_theme",
                  label: "Relaxing Theme",
                },
                {
                  value: "family_theme",
                  label: "Family Theme",
                },
                {
                  value: "romantic_theme",
                  label: "Romantic Theme",
                },
                {
                  value: "luxury_theme",
                  label: "Luxury Theme",
                },
              ]}
              styles={{
                label: {
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "20px",
                },
                input: {
                  background: "transparent",
                  borderColor: "#fff",
                  height: "45px",
                  fontSize: "16px",
                  color: "#fff",
                  ":focus": {
                    borderColor: "#fff",
                  },
                  width: "350px",
                },
              }}
            />

          </Box>
          {/* product lable */}
          <Box className="absolute top-[-25px] sm:top-[-25px] lg:top-[-40px] w-full max-w-[200px] sm:max-w-[200px] lg:max-w-[300px] bg-[#ffc700] text-white flex justify-center items-center font-bold text-3xl sm:text-3xl lg:text-5xl rounded-lg">
            <Text>PRODUCT</Text>
          </Box>
        </Box>
        {/* product cart section */}
        <Box className="my-[3rem] px-20 sm:my-[3rem] lg:my-[7rem] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[8rem] gap-y-[5rem]">
          {products?.map((item, i) => {
            return (
              <Box
                key={i}
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <ProductCard product={item} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
