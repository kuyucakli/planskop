"use client";

import { calculateRemainingDuration } from "@/lib/utils";
import { useEffect, useState } from "react";

const RemainingDuration = ({ targetDateTime }: { targetDateTime: Date }) => {
  const [duration, setDuration] = useState(
    calculateRemainingDuration(new Date(Date.now()), targetDateTime)
  );

  const update = () => {
    setDuration(
      calculateRemainingDuration(new Date(Date.now()), targetDateTime)
    );
  };

  useEffect(() => {
    const interval = setInterval(update, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <span className="flex-1 text-right text-xs">{duration}</span>;
};

export default RemainingDuration;
