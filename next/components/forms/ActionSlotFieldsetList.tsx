import { DailyActionSlot, MAX_DAILY_ACTION_SLOTS } from "@/lib/definitions";
import { FormState, parseSlotKey } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ChartDailyActionSlots } from "../charts";
import { ActionSlotFieldset } from "./ActionSlotFieldset";

type DailyActionSlotDraft = Omit<
  DailyActionSlot,
  "title" | "at" | "duration"
> & {
  title: string;
  at: string;
  duration: string;
};

export const ActionSlotList = ({
  formState,
  defaultValue,
}: {
  formState: FormState;
  defaultValue?: DailyActionSlot[] | undefined;
}) => {
  const [actionSlots, setActionSlots] = useState<DailyActionSlotDraft[]>([]);
  useEffect(() => {
    if (defaultValue) {
      setActionSlots(defaultValue);
    } else {
      setActionSlots([
        { id: crypto.randomUUID(), title: "", at: "", duration: "" },
      ]);
    }
  }, []);

  const handleAddSlot = () => {
    setActionSlots([
      ...actionSlots,
      { id: crypto.randomUUID(), title: "", at: "", duration: "" },
    ]);
  };

  const handleDeleteSlot = (id: string) => {
    const filtered = actionSlots.filter((a) => a.id !== id);
    setActionSlots(filtered);
  };

  const updateSlot = (slotKey: string, value: string) => {
    const parsedSlotKey = parseSlotKey(slotKey);

    if (!parsedSlotKey) return;

    const updated = actionSlots.map((s) => {
      if (s.id == parsedSlotKey.id) {
        return { ...s, [parsedSlotKey.field]: value };
      }
      return s;
    });

    setActionSlots(updated);
  };

  const disableAddMoreButton = actionSlots.length >= MAX_DAILY_ACTION_SLOTS;

  if (actionSlots.length == 0) return "";
  return (
    <div
      className="border-y-1 border-y-gray-500 py-8 flex flex-col gap-y-4"
      onChange={(e) => {
        const target = e.target;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        ) {
          const elId = target.id;
          updateSlot(elId, target.value);
        }
      }}
    >
      {/* <h2 className="text-md">Add daily actions:</h2> */}

      <input
        type="text"
        id="slots"
        name="slots"
        readOnly
        hidden
        value={JSON.stringify(actionSlots) || ""}
      />

      <div className="relative h-24">
        <div className="absolute opacity-80 w-full">
          <ChartDailyActionSlots
            actionSlots={actionSlots as DailyActionSlot[]}
          />
        </div>
        <div className="absolute w-full">
          <ChartDailyActionSlots interval={60} showContent />
        </div>
      </div>

      {actionSlots.map((a) => {
        return (
          <ActionSlotFieldset
            key={a.id}
            title={a?.title || ""}
            at={a?.at || ""}
            duration={a?.duration || ""}
            description={a?.description || ""}
            formState={formState}
            id={a.id}
            deleteSlot={handleDeleteSlot}
            showBtnDelete={actionSlots.length > 1}
          />
        );
      })}

      <button
        disabled={disableAddMoreButton}
        type="button"
        className="bg-transparent hover:bg-bermuda-500  text-sm hover:text-white py-2 px-4 border-0  hover:border-transparent rounded"
        onClick={handleAddSlot}
      >
        {`+ Add another action slot.`}
        <span className="text-xs text-gray-400">
          {" "}
          {`Max ${MAX_DAILY_ACTION_SLOTS}`}
        </span>
      </button>
    </div>
  );
};
