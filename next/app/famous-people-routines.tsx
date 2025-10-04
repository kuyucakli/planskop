"use client";

import { CardFamousPersonSummary } from "@/components/Card";
import { FamousPersonWithRoutines } from "@/db/schemas/famous-people-schema";
import { getFamousPeopleWithRoutines } from "@/db/queries/famousPeople";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BasicButton } from "@/components/Buttons";
import { IconArrowBack, IconArrowForward } from "@/components/Icons";

const FamousPeopleRoutines = () => {
  const [index, setIndex] = useState(0);

  const { data: famousPeopleWithRoutines } = useQuery({
    queryKey: ["famousPeopleWithRoutines"],
    queryFn: () => getFamousPeopleWithRoutines(),
  });

  if (!famousPeopleWithRoutines) return;

  const grouped = Object.values(
    famousPeopleWithRoutines.reduce((acc, row) => {
      if (!acc[row.personId]) {
        acc[row.personId] = {
          id: row.personId,
          personName: row.personName,
          image: row.image,
          routines: [],
        };
      }
      if (row.activityId) {
        acc[row.personId].routines.push({
          activityId: row.activityId,
          activityName: row.activityName,
          startsAt: row.startsAt,
          endsAt: row.endsAt,
          famousPersonId: null,
        });
      }
      return acc;
    }, {} as Record<number, FamousPersonWithRoutines>)
  );

  return (
    <div>
      <CardFamousPersonSummary
        famousPerson={grouped[index]}
        footerChildren={
          <nav aria-label="Carousel navigation" className="flex justify-end">
            <BasicButton
              action={() => setIndex(index - 1)}
              disabled={index <= 0}
              className="bg-transparent"
            >
              <IconArrowBack className="fill-neutral-200 size-4" />
            </BasicButton>
            <BasicButton
              action={() => setIndex(index + 1)}
              disabled={index >= grouped.length - 1}
              className="bg-transparent"
            >
              <IconArrowForward className="fill-neutral-200 size-4" />
            </BasicButton>
          </nav>
        }
      />
    </div>
  );
};

export { FamousPeopleRoutines };
