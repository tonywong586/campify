import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Rating,
  Skeleton,
} from "@mantine/core";
import { Product } from "~/server/models";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

//check whether is loading
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product._id}`} passHref>
      <Card
        className="w-[20rem] flex flex-col justify-center items-center"
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
      >
        <Card.Section className="py-5">
          <Image
            withPlaceholder
            src={product.images[0]}
            alt="product-image"
            fit="cover"
            height={200}
            px={20}
          />
        </Card.Section>

        <Group
          className="flex flex-col items-center justify-center"
          position="apart"
          mt="md"
          mb="md"
        >
          <Text className="text-xl font-bold line-clamp-2" weight={500}>
            {product.name}
          </Text>
          <Rating fractions={2} defaultValue={4} readOnly />
        </Group>

        <Text className="font-bold" size="md" color="dimmed">
          HKD ${product.price} {product?.rental && " / day"}
        </Text>
        <Button bg="#ffc700" color="yellow" fullWidth mt="md" radius="md">
          {product.rental ? "Rent Now" : "Buy Now"}
        </Button>
      </Card>
    </Link>
  );
}

const SkeletonCard = ({ loading }: { loading: boolean }) => (
  <Skeleton w="100%" h={270} radius="lg" visible={loading} />
);
ProductCard.Skeleton = SkeletonCard;
