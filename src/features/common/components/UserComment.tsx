import { Avatar, Box, Button, Group, Rating, Textarea } from "@mantine/core";
import React from "react";
import { formatDate, formatDateTime } from "~/utils/misc";

export const UserComment = ({
  name,
  comment,
  rating,
  date,
  avatar,
  id,
}: {
  name: string;
  comment: string;
  rating: number;
  date: string;
  avatar: string;
  id: string;
}) => {
  return (
    <div className="flex-1">
      <Box className="flex items-start justify-center flex-1 w-full p-6 mt-5 bg-white rounded-2xl shadow-gray-300 ">
        <div className="flex flex-row items-start w-full text-lg font leading-[35px] text-[#9D9D9D] text-center">
          <Avatar
            variant="filled"
            radius="100%"
            w={38}
            mr={16}
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
          ></Avatar>
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between">
              <div className="text-lg font-bold text-black">{name}</div>
              <div className="text-sm font-bold text-[#9D9D9D]">
                {formatDateTime(new Date(date))}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <Rating
                fractions={2}
                defaultValue={rating}
                size="xs"
                readOnly
              ></Rating>
            </div>
            <div className="text-lg font leading-[35px] border-2 border-[#9D9D9D] text-[#9D9D9D] pt-2 text-start">
              {comment}
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};
