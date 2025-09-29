export default function CancelledPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-green-600">Reminder cancelled</h1>
      {searchParams.id && (
        <p>Your reminder with ID {searchParams.id} has been cancelled.</p>
      )}
    </main>
  );
}
