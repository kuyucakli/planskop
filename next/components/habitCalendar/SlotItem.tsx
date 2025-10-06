"use client";

import { DailyActionSlot } from "@/db/schemas/daily-plans-schema";

import {
  createCompletionId,
  getDetailedSlotTimes,
} from "@/lib/utils/dailyPlan";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActionSlotCompletion } from "@/db/queries/dailyPlans";
import { ButtonCheckable, ButtonCldUpload } from "../Buttons";
import { DurationToStart } from "./DurationToStart";
import {
  deleteActionSlotCompletion,
  upsertActionSlotCompletion,
} from "@/db/mutations/dailyPlans";
import { CardImage } from "../Card";

type CompletionMutationPayload = {
  newCheckVal: boolean;
  imageUrl?: string;
  imagePublicId?: string;
};

export const SlotItem = ({
  actionDate,
  dailyPlanId,
  slotData: s,
  startUtcMs,
  startLocalMs,
  timezone,
  userId,
}: {
  actionDate: string;
  dailyPlanId: number;
  slotData: DailyActionSlot;
  startUtcMs: number;
  startLocalMs: number;
  timezone: string;
  userId: string;
}) => {
  const { startDtMs: startUtcDtMs, endDtMs: endUtcDtMs } = getDetailedSlotTimes(
    new Date(startLocalMs).toISOString().slice(0, 10),
    s.at,
    s.duration,
    timezone
  );

  const completionId = createCompletionId(startUtcDtMs, s.id, dailyPlanId);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["completion", completionId],
    queryFn: () => getActionSlotCompletion(completionId),
  });

  const rowIdInDb = data?.[0]?.id;

  const isCompletedFromServer = !!data?.length;

  const completionMutation = useMutation({
    mutationFn: (payload: CompletionMutationPayload) => {
      const { newCheckVal, imageUrl, imagePublicId } = payload;
      if (newCheckVal) {
        return upsertActionSlotCompletion({
          completed: true,
          dailyPlanId,
          userId,
          actionDate,
          actionTime: new Date(startUtcDtMs),
          actionTitle: s.title,
          actionId: completionId,
          imageUrl,
          imagePublicId,
        });
      } else {
        if (!rowIdInDb) {
          return Promise.resolve() as Promise<never>;
        }
        return deleteActionSlotCompletion(rowIdInDb, data?.[0]?.imagePublicId);
      }
    },
    onMutate: async (payload: CompletionMutationPayload) => {
      const { newCheckVal } = payload;
      // Cancel queries so they don't overwrite optimistic update
      await queryClient.cancelQueries({
        queryKey: ["completion", completionId],
      });

      // Snapshot previous value
      const prev = queryClient.getQueryData(["completion", completionId]);

      // Optimistically update
      queryClient.setQueryData(["completion", completionId], (old: any) => {
        if (newCheckVal) {
          return [{ completed: true, id: Date.now() }]; // fake completion
        } else {
          return [];
        }
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // Rollback on error
      if (ctx?.prev) {
        queryClient.setQueryData([completionId], ctx.prev);
      }
    },
    onSettled: () => {
      // Always refetch after success/error to sync with DB
      queryClient.invalidateQueries({ queryKey: ["completion", completionId] });
    },
  });

  const handleCheck = (newCheckVal: boolean) => {
    completionMutation.mutate({ newCheckVal }); // background server sync
  };

  const handleCldSuccess = (result: any) => {
    const imageUrl = result.info.secure_url;
    const imagePublicId = result.info.public_id;
    completionMutation.mutate({ newCheckVal: true, imageUrl, imagePublicId });
  };

  return (
    <li
      key={s.id}
      className={`flex gap-4 py-2  my-4  border-1 border-zinc-800 rounded-lg bg-gradient-to-b from-10% from-zinc-900  to-90% to-zinc-800 `}
    >
      <div className="basis-12 relative">
        {data && (
          <ButtonCheckable
            onCheck={handleCheck}
            checked={isCompletedFromServer}
            disabled={startUtcDtMs > Date.now()}
          />
        )}
      </div>
      <div className="basis-12 relative">
        <ButtonCldUpload
          onCldSuccess={handleCldSuccess}
          disabled={!!!rowIdInDb}
        />
      </div>

      <div className="flex gap-4 flex-1">
        <div className={`flex flex-col justify-between`}>
          <h2 className="text-md  capitalize">{s.title}</h2>

          <p className="text-xs ">
            at {s.at} for {s.duration}
          </p>
        </div>
      </div>
      <div className="basis-24 flex items-center">
        <DurationToStart startDtMs={startUtcDtMs} endDtMs={endUtcDtMs} />
      </div>
      {/* <div className="basis-24 flex items-center justify-center">
        {data && data[0]?.imageUrl && (
          <CardImage path={data[0].imageUrl} altText="test" />
        )}
      </div> */}
    </li>
  );
};
