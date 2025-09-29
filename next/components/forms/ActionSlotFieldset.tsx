import { FormState } from "@/lib/utils";
import { IconClose, IconInfo } from "../Icons";
import { FieldError } from "./FormFieldError";
import { useState } from "react";
import FormComboBox from "./FormComboBox";
import { DATA_I_CAN_ACTIONS } from "@/data";
import { ALLOWED_TIMES, TIME_BASED_DURATIONS } from "@/lib/definitions";

export const ActionSlotFieldset = ({
  id,
  title,
  at,
  duration,
  description,
  formState,
  deleteSlot,
  showBtnDelete,
}: {
  id: string;
  title: string;
  description: string;
  at: string;
  duration: string;
  showBtnDelete: boolean;
  formState: FormState;
  deleteSlot: (id: string) => void;
}) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <fieldset className="bg-stone-900 flex flex-col gap-2 rounded-xl p-6 ">
      <div className="flex flex-row flex-wrap gap-x-2 gap-y-8 @container">
        <FormComboBox
          name={`slots[${id}].title`}
          label="I can"
          labelClassName="flex-1 @xl:flex-1"
          className=" border-0 border-b-2 rounded-none block w-full"
          options={DATA_I_CAN_ACTIONS}
          formState={formState}
          required={true}
          placeholder="swim"
          defaultValue={title}
        />
        <FormComboBox
          name={`slots[${id}].at`}
          label="at"
          labelClassName="flex-1  @xl:flex-1"
          className=" border-0 border-b-2 rounded-none block w-full"
          options={ALLOWED_TIMES}
          formState={formState}
          required={true}
          placeholder="12:00"
          defaultValue={at}
        />
        <FormComboBox
          name={`slots[${id}].duration`}
          label="duration"
          labelClassName="flex-[0_1_100%]  @xl:flex-1"
          className=" border-0 border-b-2 rounded-none block w-full"
          options={TIME_BASED_DURATIONS}
          formState={formState}
          required={true}
          placeholder="1 Hour"
          defaultValue={duration}
        />
      </div>

      <label>
        <button
          type="button"
          onClick={() => {
            setShowDescription(!showDescription);
          }}
          className="flex items-center gap-x-2 mt-2"
        >
          <IconInfo
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          />
        </button>
        <textarea
          name={`slots[${id}].description`}
          id={`slots[${id}].description`}
          defaultValue={description}
          placeholder="Description"
          hidden={!showDescription}
          className="w-full border-1 border-gray-600 p-2 rounded-sm h-24 text-xs mt-2"
        />
        <FieldError formState={formState} name={`slots[${id}].description`} />
      </label>
      {showBtnDelete && (
        <button
          type="button"
          className="self-end"
          onClick={(e) => {
            deleteSlot(id);
          }}
        >
          <IconClose
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#EA3323"
          />
        </button>
      )}
    </fieldset>
  );
};
