import { getActionPlan } from "@/db/queries";
import Link from "next/link";

export default async function DetailPage({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  return (
    <>
      <h1>Hello detail</h1>
    </>
  );
}
