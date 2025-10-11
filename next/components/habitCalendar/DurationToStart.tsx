import { useTimeDiffToNow } from "@/hooks/useTimeDiff";
import StatusLabel from "../StatusLabel";

export const DurationToStart = ({
  startDtMs,
  endDtMs,
  isDone,
}: {
  startDtMs: number;
  endDtMs: number;
  isDone: boolean;
}) => {
  const durationToStart = useTimeDiffToNow(startDtMs, endDtMs);
  return <StatusLabel state={isDone ? "done" : durationToStart.state} />;
};
