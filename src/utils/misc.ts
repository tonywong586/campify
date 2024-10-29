import format from "dayjs";

//boolean to yes/no
export const booleanToYesNo = (boolean: boolean) => {
  return boolean ? "Yes" : "No";
};

//format date
export const formatDate = (date: Date) => {
  return format(date).format("DD/MM/YYYY");
};

//format date time
export const formatDateTime = (date: Date) => {
  return format(date).format("DD/MM/YYYY HH:mm");
};

export const calcDays = (start: Date, end: Date) => {
  return format(end).diff(format(start), "day");
};

export const areDatesEqualIgnoringTime = (
  date1?: Date,
  date2?: Date
): boolean => {
  if (!date1 || !date2) return false;

  return format(date1).isSame(format(date2), "day");
};
