import { Navbar } from "./_components/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-x-hidden">{children}</main>
    </>
  );
}
