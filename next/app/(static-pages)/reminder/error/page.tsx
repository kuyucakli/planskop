export default function ErrorPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-red-600">
        Something went wrong ❌
      </h1>
      {searchParams.id && (
        <p>We couldn’t cancel your reminder with ID {searchParams.id}.</p>
      )}
    </main>
  );
}
