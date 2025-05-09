

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {
  return (
    <>
      <h1> &#128142; Me, Myself, Dashboard</h1>
      {children}
    </>
  );
}
