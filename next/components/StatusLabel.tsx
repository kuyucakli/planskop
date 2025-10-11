"use client";

import { IconStarShine } from "./Icons";

const StatusLabel = ({
  state,
}: {
  state: "upcoming" | "ongoing" | "ended" | "done";
}) => {
  return (
    <span
      className={`text-xs rounded-md border-1 border-gray-700 bg-gray-900 inline-flex gap-1 w-24 h-6 items-center justify-center ${
        state == "done" ? "text-green-400 border-green-900" : ""
      }`}
    >
      {state !== "done" && (
        <span
          className={` w-2 h-2 flex rounded-full ${
            state == "ongoing" ? "bg-green-400" : "bg-gray-600"
          }`}
        ></span>
      )}
      {state == "done" && <IconStarShine className="fill-green-400 size-5" />}
      {state}
    </span>
  );
};

export default StatusLabel;
