import { useTimeDiffToNow } from "@/hooks/useTimeDiff";
import StatusLabel from "../StatusLabel";

export const DurationToStart = ({
  startDtMs,
  endDtMs,
}: {
  startDtMs: number;
  endDtMs: number;
}) => {
  const durationToStart = useTimeDiffToNow(startDtMs, endDtMs);
  return <StatusLabel state={durationToStart.state} />;
};
