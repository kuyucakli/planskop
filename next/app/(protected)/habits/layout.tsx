import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Daily Plans",
};

export default async function Layout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
