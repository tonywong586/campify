import { Select, SelectProps } from "@mantine/core";
import { CATEGORY } from "~/utils/category";

export const CategoryPicker = (
  props: Omit<SelectProps, "data"> & React.RefAttributes<HTMLInputElement>
) => {
  return (
    <Select
      {...props}
      label="Category"
      placeholder=""
      withAsterisk
      radius="md"
      size="md"
      data={CATEGORY}
    />
  );
};
