"use client";

import { UseThemeContext } from "@/context/ThemeContext";
import { DailyActionSlot } from "@/db/schemas/daily-plans-schema";
import styles from "./Charts.module.css";
import { extractTimeRange } from "@/lib/utils";

const ChartDailyActionSlots = ({
  actionSlots,
  compact = false,
  interval = 15,
  showContent = false,
}: {
  actionSlots?: DailyActionSlot[];
  compact?: boolean;
  interval?: number;
  showContent?: boolean;
}) => {
  const { colors } = UseThemeContext();
  const colorIndexes: Record<number, string> = {};
  let reservedMinutes: Set<number> | undefined;
  if (actionSlots) {
    reservedMinutes = actionSlots.reduce((acc, actionSLot, index) => {
      extractTimeRange(
        actionSLot.at,
        actionSLot.duration,
        15,
        false,
        true
      ).forEach((t) => {
        acc.add(t);
        colorIndexes[t] = colors[index];
      });
      return acc;
    }, new Set<number>());
  }

  const minutesInDay = 24 * 60;
  const dayMinutesByInterval = Array.from(
    { length: minutesInDay / interval },
    (_, index) => index * interval
  );

  const boxWidthInFlexRow = 100 / ((minutesInDay / interval) * 0.5);

  return (
    <div
      className={` text-gray-500   text-xs ${styles.ChartContainer} ${
        compact ? styles.Compact : ""
      }`}
    >
      <span className="text-amber-100/60 ">Preview of your selected hours</span>
      <ul className="flex  flex-wrap shadow-sm shadow-black/50 mt-2">
        {dayMinutesByInterval.map((m, index) => {
          const isActive = !!reservedMinutes?.has(m);
          return (
            <MinuteBox
              key={m}
              className="border-1 flex"
              content={
                showContent
                  ? (Math.floor(m / 60) + "").padStart(2, "0") + ":00"
                  : ""
              }
              style={{
                width: `${boxWidthInFlexRow}%`,
                backgroundColor: isActive ? colorIndexes[m] : "transparent",
              }}
              active={isActive}
            />
          );
        })}
      </ul>
    </div>
  );
};

const MinuteBox = ({
  content,
  className,
  active = false,
  style,
  bg,
}: React.LiHTMLAttributes<HTMLLIElement> & {
  active?: boolean;
  bg?: string;
}) => {
  return active ? (
    <li className={` blur-xs bg-amber-200   ${className}`} style={style}>
      {" "}
      {content}
    </li>
  ) : (
    <li
      className={`border-1 border-t-0 border-l-0 border-dotted border-stone-600 flex  text-amber-100/60  ${className} ${styles.QuarterMinute}`}
      style={style}
    >
      {" "}
      {content}
    </li>
  );
};

export { ChartDailyActionSlots };
