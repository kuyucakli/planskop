import { FamousPeopleRoutines } from "@/app/famous-people-routines";
import { CardFamousPersonSummary } from "@/components/Card";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <h1 className="text-2xl  l-h sticky top-0 left-0 backdrop-blur-sm my-4">
        Inspiration
      </h1>
      <Suspense
        fallback={
          <CardFamousPersonSummary
            famousPerson={{ image: "", personName: "", routines: [] }}
            isSkeletonView
          />
        }
      >
        <FamousPeopleRoutines />
      </Suspense>
    </>
  );
}
