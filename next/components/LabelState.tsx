"use client";

import { PropsWithChildren } from "react";

const LabelState = ({
  state, 
}:{state:"upcoming" | "ongoing" | "ended"}) => {
  
  return (
    <span className="text-xs rounded-md border-1 border-gray-700 bg-gray-900 inline-flex gap-1 w-24 h-6 items-center justify-center">
      <span className={` w-2 h-2 flex rounded-full ${state == "ongoing" ?"bg-green-400" : "bg-gray-600"}`}></span>
      {state}
    </span>
  );
};

export default LabelState;
