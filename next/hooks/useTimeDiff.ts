import { dtparts, msTimeDiff } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

enum STATE {
  ENDED = "ended",
  ONGOING = "ongoing",
  UPCOMING = "upcoming",
}

const useTimeDiffToNowB = (
  startDtMs: number,
  endDtMs: number,
  updateInterval = 10000
) => {
  const compareDtMs = () => {
    const nowDtMs = Date.now();
    
    if (nowDtMs > endDtMs) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, state: STATE.ENDED };
    } else if (nowDtMs > startDtMs) {
      return { ...msTimeDiff(nowDtMs, startDtMs), state: STATE.ONGOING };
    } else {
      return { ...msTimeDiff(startDtMs, nowDtMs), state: STATE.UPCOMING };
      
    }
  };

  const [diff, setDiff] = useState<
    { state: "upcoming" | "ongoing" | "ended" } & dtparts
  >(compareDtMs());

  const update = () => {
    const compared = compareDtMs();
    setDiff(compared);
  };

  useEffect(() => {
    const interval = setInterval(update, updateInterval);
    return () => {
      clearInterval(interval);
    };
  }, [startDtMs, endDtMs, updateInterval]);

  return diff;
};

function useTimeDiffToNow(
  startDtMs: number,
  endDtMs: number,
  updateInterval = 10000
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const compareDtMs = () => {
    const nowDtMs = Date.now();

    if (nowDtMs > endDtMs) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, state: STATE.ENDED };
    } else if (nowDtMs >= startDtMs) {
      return { ...msTimeDiff(endDtMs, nowDtMs), state: STATE.ONGOING };
    } else {
      return { ...msTimeDiff(startDtMs, nowDtMs), state: STATE.UPCOMING };
    }
  };

  const [diff, setDiff] = useState(compareDtMs);

  useEffect(() => {
    // Clear old interval if exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const update = () => setDiff(compareDtMs());
    update(); // run immediately

    intervalRef.current = setInterval(update, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startDtMs, endDtMs, updateInterval]);

  return diff;
}

export { useTimeDiffToNow };
