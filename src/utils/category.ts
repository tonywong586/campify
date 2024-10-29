export const CATEGORY = [
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
];

// convert category to string
export const categoryToString = (category: string) => {
  const categoryObject = CATEGORY.find((item) => item.value === category);
  return categoryObject?.label;
};
